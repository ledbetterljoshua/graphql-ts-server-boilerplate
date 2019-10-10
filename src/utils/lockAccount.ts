import { removeAllUsersSessions } from "./removeAllUsersSessions";
import { User } from "../entity/User";

export const lockAccount = async (userId: string, reason: string) => {
  // can't login
  await User.update(
    { id: userId },
    { accountLocked: true, accountLockedReason: reason }
  );
  // remove all sessions
  await removeAllUsersSessions(userId);
};
