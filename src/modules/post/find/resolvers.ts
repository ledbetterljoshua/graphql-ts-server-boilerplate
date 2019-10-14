import { ResolverMap } from "../../../types/graphql-utils";
import { Post } from "../../../entity/Post";

export const resolvers: ResolverMap = {
  Query: {
    findPosts: async () => {
      return Post.find({ relations: ["user"] });
    }
  }
};
