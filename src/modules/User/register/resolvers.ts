import { ResolverMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";
import { getErrorData } from "../../../utils/getErrorData";
import * as yup from "yup";
import { formatYupError } from "../../../utils/formatYupError";
import { createConfirmEmailLink } from "../../../utils/createConfirmEmailLink";
// import { sendEmail } from "../../utils/sendEmail";

import { duplicateEmail } from "../shared/errorMessages";
import {
  emailValidation,
  registerPasswordValidation
} from "../../../yupSchemas";

const isTesting = process.env.NODE_ENV === "test";

const schema = yup.object().shape({
  email: emailValidation,
  password: registerPasswordValidation
});

export const resolvers: ResolverMap = {
  Query: {
    bye: (_, __, { viewer }) => viewer
  },
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments, { url }) => {
      const { email, password } = args;

      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const userInDb = await User.findOne({ where: { email }, select: ["id"] });

      if (userInDb) {
        return [getErrorData("email", duplicateEmail)];
      }

      const user = User.create({
        email,
        password
      });

      await user.save();

      const link = await createConfirmEmailLink(url, user.id);

      if (!isTesting) {
        console.log("should said email with link", link);
        // await sendEmail(email, link);
      }

      return null;
    }
  }
};
