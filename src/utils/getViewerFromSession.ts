import { User } from "../entity/User";
import { Session } from "../types/graphql-utils";

export const getViewerFromSession = async (
  session: Session
): Promise<User | null> => {
  if (!session) {
    return null;
  }
  const { userId } = session;
  if (!userId) {
    return null;
  }
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return null;
  }
  return user;
};
