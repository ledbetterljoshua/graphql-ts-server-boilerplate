import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";
import { redis } from "../redis";

export const getExpressRateLimit = (
  limit: number = 1000,
  interval: number = 15 * 60 * 1000,
  message: string = "Too many requests have been sent, please try again in 15 minutes"
) =>
  new RateLimit({
    store: new RateLimitRedisStore({
      client: redis
    }),
    windowMs: interval, // 15 minutes
    max: limit, // limit each IP to 100 requests per windowMs
    message
  });
