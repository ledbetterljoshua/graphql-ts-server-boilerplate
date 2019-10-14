import { ResolverMap } from "../../../types/graphql-utils";
import { Post } from "../../../entity/Post";
// import { isAuthenticated } from "../../shared/isAuthenticated";

export const resolvers: ResolverMap = {
  Mutation: {
    deletePost: async (_, { id }, { viewer }) => {
      // isAuthenticated(session);

      if (!viewer) {
        throw new Error("You are not allowed!");
      }

      const post = await Post.findOne({ where: { id } });

      if (!post) {
        throw new Error("does not exist");
      }

      if (viewer.id !== post.userId) {
        // log message
        console.log(
          `this user ${viewer.id} is trying to delete a post they don't own`
        );
        throw new Error("not authorized");
      }

      await Post.remove(post);

      return true;
    }
  }
};
