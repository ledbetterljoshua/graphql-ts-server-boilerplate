import { ResolverMap } from "../../../types/graphql-utils";

export const resolvers: ResolverMap = {
  Query: {
    dummy: () => "dummy"
  },
  Mutation: {
    logout: (_, __, { session }) => {
      session.destroy(err => {
        console.log(err);
      });
      return true;
    }
  }
};
