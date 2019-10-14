import { ResolverMap } from "../../../types/graphql-utils";
import { Post } from "../../../entity/Post";
import { User } from "../../../entity/User";
// import { listingCacheKey } from "../../../constants";
// import { isAuthenticated } from "../../shared/isAuthenticated";

// house.png
// aseq2-house.png
// image/png
// image/jpeg
// ['image', 'jpeg']
// 'jpeg'

const isAuthenticated = (viewer: User) => {
  if (!viewer || !viewer.confirmed || viewer.accountLocked) {
    throw new Error("Not Authenticated");
  }
};

export const resolvers: ResolverMap = {
  Mutation: {
    createPost: async (_, { input: { ...data } }, { viewer }) => {
      // isAuthenticated(session);
      // const pictureUrl = picture ? await processUpload(picture) : null;
      if (!viewer) {
        return false;
      }
      isAuthenticated(viewer);

      const post = await Post.create({
        ...data,
        userId: viewer.id
      }).save();

      // redis.lpush(listingCacheKey, JSON.stringify(listing));
      console.log("inside createPost", post);

      return true;
    }
  }
};
