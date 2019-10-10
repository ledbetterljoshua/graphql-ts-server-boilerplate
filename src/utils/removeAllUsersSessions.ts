import { userSessionIdPrefix, redisSessionPrefix } from "../constants";
import { redis } from "../redis";

export const removeAllUsersSessions = async (userId: string) => {
  const sessionIds = await redis.lrange(
    `${userSessionIdPrefix}${userId}`,
    0,
    -1
  );

  const promises = [];

  for (const sess of sessionIds) {
    promises.push(redis.del(`${redisSessionPrefix}${sess}`));
  }
  await Promise.all(promises);
};
