import { User } from "../entity/User";
import { Response, Request } from "express";
import { redis } from "../redis";

export const confirmEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (!userId) {
      return res.send("invalid");
    }
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(id);
    return res.send("ok");
  } catch (err) {
    return res.send(err);
  }
};
