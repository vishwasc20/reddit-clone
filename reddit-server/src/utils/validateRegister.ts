import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import { VALID_EMAIL_REGEX } from "../constants";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "username length must be greater than 2",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username cannot include @",
      },
    ];
  }
  if (!VALID_EMAIL_REGEX.test(options.email)) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }
  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "password length must be greater than 3",
      },
    ];
  }
  return null;
};
