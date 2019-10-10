import * as yup from "yup";
import * as bcrypt from "bcryptjs";
import { registerPasswordValidation } from "../../../yupSchemas";
import { ResolverMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";
import { userNotFoundError, expiredKeyError } from "../shared/errorMessages";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
import { forgotPasswordPrefix } from "../../../constants";
import { formatYupError } from "../../../utils/formatYupError";
import { lockAccount } from "../../../utils/lockAccount";
import { redis } from "../../../redis";

const schema = yup.object().shape({
  newPassword: registerPasswordValidation
});

export const resolvers: ResolverMap = {
  Query: {
    dummy2: () => "bye"
  },
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments
    ) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return [
          {
            path: "email",
            message: userNotFoundError
          }
        ];
      }

      await lockAccount(user.id, "forgot password");
      // @todo add frontend url
      await createForgotPasswordLink("", user.id);
      // @todo send email with url
      return true;
    },
    forgotPasswordChange: async (
      _,
      { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments
    ) => {
      const redisKey = `${forgotPasswordPrefix}${key}`;

      const userId = await redis.get(redisKey);
      if (!userId) {
        return [
          {
            path: "key",
            message: expiredKeyError
          }
        ];
      }

      try {
        await schema.validate({ newPassword }, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatePromise = User.update(
        { id: userId },
        {
          accountLocked: false,
          accountLockedReason: "",
          password: hashedPassword
        }
      );

      const deleteKeyPromise = redis.del(redisKey);

      await Promise.all([updatePromise, deleteKeyPromise]);

      return null;
    }
  }
};
