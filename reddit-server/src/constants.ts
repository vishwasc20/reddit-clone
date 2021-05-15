export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "qid";
export const FORGET_PASSWORD_PREFIX = "forget-password:";

export const VALID_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const RESET_PASSWORD_TEMPLATE = (token) =>
  `<a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`;
export const REDIS_HOST = __prod__ ? "redis-auth-service" : "localhost";
export const CORS_HOST = __prod__
  ? "http://localhost:8080"
  : "http://localhost:3000";
