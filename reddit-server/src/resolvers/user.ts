import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import {
  AUTH_COOKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  RESET_PASSWORD_TEMPLATE,
  VALID_EMAIL_REGEX,
} from "../constants";
import { UsernamePasswordInput } from "../types";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 as uuid } from "uuid";
import { UserResponse } from "../types";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password length must be greater than 3",
          },
        ],
      };
    }

    const redisKey = `${FORGET_PASSWORD_PREFIX}${token}`;
    const userId = await redis.get(redisKey);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(redisKey);

    // log in user after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    if (!VALID_EMAIL_REGEX.test(email)) {
      return false;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = uuid();

    await redis.set(
      `${FORGET_PASSWORD_PREFIX}${token}`,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(email, RESET_PASSWORD_TEMPLATE(token));

    return true;
  }

  @Query(() => User, { nullable: true })
  currentUser(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const invalidRegistrationErrors = validateRegister(options);

    if (invalidRegistrationErrors) {
      return { errors: invalidRegistrationErrors };
    }

    const hashedPassword = await argon2.hash(options.password);
    try {
      const user = await User.create({
        username: options.username,
        password: hashedPassword,
        email: options.email,
      }).save();

      req.session.userId = user.id;

      return { user };
    } catch (err) {
      return {
        errors: [
          {
            field: "generic-error",
            message: err.detail,
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      VALID_EMAIL_REGEX.test(usernameOrEmail)
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err: Error) => {
        res.clearCookie(AUTH_COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
