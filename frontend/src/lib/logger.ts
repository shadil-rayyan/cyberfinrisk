// lib/logger.ts
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

// For environments like Netlify/Cloudflare, we want to avoid 
// pino-pretty in production because it uses worker threads 
// which are not available in Edge runtimes.
const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  // In development, we can try pino-pretty, but check if we're in a browser/edge first
  transport: !isProd && typeof window === 'undefined' ? {
    target: "pino-pretty",
    options: { colorize: true },
  } : undefined,
  // Ensure timestamp is present for log aggregators
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
