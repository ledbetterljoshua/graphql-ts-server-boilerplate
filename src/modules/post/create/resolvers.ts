import { ResolverMap } from "../../../types/graphql-utils";
import { Post } from "../../../entity/Post";
import { User } from "../../../entity/User";
import { notAuthenticated } from "../shared/errorMessages";
import { Upvote } from "../../../entity/Upvote";

export const notAuthenticatedError = {
  post: null,
  path: "authentication",
  message: notAuthenticated
};
export const successObject = {
  post: null,
  path: "create post",
  message: "success!"
};

const isAuthenticated = (viewer: User | undefined) => {
  if (!viewer || !viewer.confirmed || viewer.accountLocked) {
    return false;
  }
  return true;
};

export const resolvers: ResolverMap = {
  Mutation: {
    createPost: async (_, { input: { ...data } }, { viewer }) => {
      // isAuthenticated(session);
      // const pictureUrl = picture ? await processUpload(picture) : null;
      if (!viewer || !isAuthenticated(viewer)) {
        return [notAuthenticatedError];
      }

      const post = await Post.create({
        ...data,
        userId: viewer.id
      }).save();

      await Upvote.create({
        postId: post.id,
        userId: viewer.id
      }).save();

      // redis.lpush(listingCacheKey, JSON.stringify(listing));

      return [{ ...successObject, post }];
    }
  }
};
