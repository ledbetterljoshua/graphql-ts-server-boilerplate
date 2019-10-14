import * as Redis from "ioredis";

const { NODE_ENV, REDIS_URL } = process.env;

const isProd = NODE_ENV === "production";

export const redis = isProd ? new Redis(REDIS_URL) : new Redis();
