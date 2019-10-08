import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import { errorMessages } from "./constants";
import * as bcrypt from "bcryptjs";
// import { User } from "../../entity/User";
// import { getErrorData } from "../../utils/getErrorData";
// import { formatYupError } from "../../utils/formatYupError";
// import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";

// const isTesting = process.env.NODE_ENV === "test";
const { invalidLogin, confirmEmail } = errorMessages;

const invalidEmailError = {
  path: "email",
  message: invalidLogin
};
const confirmEmailError = {
  path: "email",
  message: confirmEmail
};

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => "die"
  },
  Mutation: {
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return [invalidEmailError];
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return [invalidEmailError];
      }

      if (!user.confirmed) {
        return [confirmEmailError];
      }

      return null;
    }
  }
};
