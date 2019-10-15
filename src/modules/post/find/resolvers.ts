import { ResolverMap } from "../../../types/graphql-utils";
import { Post } from "../../../entity/Post";
import { Upvote } from "../../../entity/Upvote";

export const resolvers: ResolverMap = {
  Post: {
    upvoteCount: async post => {
      return (post.upvotes && post.upvotes.length) || 0;
    },
    upvoted: async (post, _, { viewer }) => {
      const getUpvoted = (vote: Upvote) => {
        if (!vote || !viewer) return;
        return (vote.userId = viewer.id);
      };
      if (!post.upvotes) return false;
      const userUpvoted = post.upvotes.map(getUpvoted);
      return Boolean(userUpvoted.length);
    },
    user: async (_, __, { viewer, userLoader }) => userLoader.load(viewer!.id)
  },
  Query: {
    findPosts: async () => {
      const posts = await Post.find({ relations: ["user", "upvotes"] });
      return posts;
    }
  }
};
