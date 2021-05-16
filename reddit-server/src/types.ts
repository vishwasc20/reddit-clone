import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { Field, ObjectType, InputType } from "type-graphql";
import { User } from "./entities/User";

@InputType()
export class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  email: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

interface SessionData {
  [key: string]: any;
}

export type MyContext = {
  req: Request & { session: Session & SessionData };
  res: Response;
  redis: Redis;
};
