import { ResolverMap } from "../../../types/graphql-utils";
import { removeAllUsersSessions } from "../../../utils/removeAllUsersSessions";

export const resolvers: ResolverMap = {
  Query: {
    dummy: () => "dummy"
  },
  Mutation: {
    logout: async (_, __, { session, session: { userId } }) => {
      if (userId) {
        await removeAllUsersSessions(userId);
        session.destroy(err => {
          if (err) {
            console.log(err);
          }
        });
        return true;
      }
      return false;
    }
  }
};
