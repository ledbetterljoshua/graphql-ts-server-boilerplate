import { ResolverMap } from "../../../types/graphql-utils";

export const resolvers: ResolverMap = {
  Query: {
    dummy: () => "dummy"
  },
  Mutation: {
    logout: (_, __, { session }) => {
      return session.destroy(
        err =>
          new Promise(res => {
            if (err) {
              console.log(err);
            }
            res(true);
          })
      );
    }
  }
};
