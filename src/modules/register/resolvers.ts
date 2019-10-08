import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import { getErrorData } from "../../utils/getErrorData";
import * as yup from "yup";
import { formatYupError } from "../../utils/formatYupError";
import { errorMessages } from "./constants";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
// import { sendEmail } from "../../utils/sendEmail";

const isTesting = process.env.NODE_ENV === "test";

const {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} = errorMessages;

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail),
  password: yup
    .string()
    .min(6, passwordNotLongEnough)
    .max(255)
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => "die"
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

      const hashed = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashed
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
