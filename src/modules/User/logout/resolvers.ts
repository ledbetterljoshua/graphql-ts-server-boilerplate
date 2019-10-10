import { ResolverMap } from "../../../types/graphql-utils";
import { userSessionIdPrefix, redisSessionPrefix } from "../../../constants";
import { redis } from "../../../redis";

export const resolvers: ResolverMap = {
  Query: {
    dummy: () => "dummy"
  },
  Mutation: {
    logout: async (_, __, { session: { userId } }) => {
      if (userId) {
        const sessionIds = await redis.lrange(
          `${userSessionIdPrefix}${userId}`,
          0,
          -1
        );

        const promises: any[] = [];

        for (const sess of sessionIds) {
          promises.push(redis.del(`${redisSessionPrefix}${sess}`));
        }
        await Promise.all(promises);

        return true;
      }
      return false;
    }
  }
};
