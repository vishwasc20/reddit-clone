// import { getIPv4Address } from "./utils/get-ip-address";

export const __prod__ = process.env.NODE_ENV === "production";

export const DOCKER_DEV_ENV = process.env.DOCKER_DEV === "true";

export const AUTH_COOKIE_NAME = "qid";

export const FORGET_PASSWORD_PREFIX = "forget-password:";

export const VALID_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const REDIS_URL = process.env.REDIS_URL;
// ||  "redis-auth-service" : "localhost";
export const SESSION_SECRET = process.env.SESSION_SECRET;

export const CORS_HOST = process.env.CORS_HOST;
// ? "http://localhost:8080"
// : "http://localhost:3000";

export const RESET_PASSWORD_TEMPLATE = (token: string) =>
  `<a href="${CORS_HOST}/reset-password/${token}">Reset Password</a>`;

export const PORT = parseInt(process.env.PORT) || 4000;

// const POSTGRES_HOST = getIPv4Address();

export const POSTGRES_URL =
  // process.env.DATABASE_URL ||
  `postgresql://postgres:postgres@postgres-db-service:5432/reddittypeorm`;
