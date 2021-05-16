import { getIPv4Address } from "./utils/get-ip-address";

export const __prod__ = process.env.NODE_ENV === "production";

export const DOCKER_DEV_ENV = process.env.DOCKER_DEV === "true";

export const AUTH_COOKIE_NAME = "qid";

export const FORGET_PASSWORD_PREFIX = "forget-password:";

export const VALID_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const RESET_PASSWORD_TEMPLATE = (token: string) =>
  `<a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`;

export const REDIS_HOST = DOCKER_DEV_ENV ? "redis-auth-service" : "localhost";

export const CORS_HOST = DOCKER_DEV_ENV
  ? "http://localhost:8080"
  : "http://localhost:3000";

export const PORT = 4000;

export const POSTGRES_HOST = getIPv4Address();
