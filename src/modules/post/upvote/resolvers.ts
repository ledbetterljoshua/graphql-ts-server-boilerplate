import { ResolverMap } from "../../../types/graphql-utils";
import {
  userDoesNotExistError,
  postDoesNotExistError
} from "../delete/resolvers";
import { Post } from "../../../entity/Post";
import { Upvote } from "../../../entity/Upvote";

export const upvoteSuccessObject = {
  path: "success",
  message: "post upvoted"
};
export const upvoteRemoveSuccessObject = {
  path: "success",
  message: "upvote removed"
};

export const resolvers: ResolverMap = {
  Mutation: {
    upvotePost: async (_, { id }, { viewer }) => {
      if (!viewer) {
        return [userDoesNotExistError];
      }

      const post = await Post.findOne({ where: { id } });

      if (!post) {
        return [postDoesNotExistError];
      }

      const vote = await Upvote.findOne({
        where: { userId: viewer.id, postId: post.id }
      });

      if (vote) {
        await Upvote.remove(vote);
        return [upvoteRemoveSuccessObject];
      }

      await Upvote.create({
        userId: viewer.id,
        postId: post.id
      }).save();

      return [upvoteSuccessObject];
    }
  }
};
