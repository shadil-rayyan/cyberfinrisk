// lib/logger.ts
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino(
  isProd
    ? { level: "info" } // JSON structured logs in production
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
        level: "debug", // verbose in development
      }
);

export default logger;
