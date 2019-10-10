import { User } from "../../../entity/User";
import { Connection } from "typeorm";
import { TestClient } from "../../../utils/TestClient";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
import { lockAccount } from "../../../utils/lockAccount";
import { createTestConn } from "../../../test-utils/createTestConn";

import {
  expiredKeyError,
  passwordNotLongEnough,
  forgotPasswordLockedError
} from "../shared/errorMessages";

let conn: Connection;
const email = "bob1@bob.com";
const password = "jlkajoioiqwe";
const newPassword = "qowuieoiqwueoq";

let key: string;
let userId: string;
beforeAll(async () => {
  conn = await createTestConn();
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

afterAll(async () => {
  await conn.close();
});

const client = new TestClient();

describe("forgot password", () => {
  test("lock account", async () => {
    const reason = "forgot password";

    // lock account
    await lockAccount(userId, reason);
    const url = await createForgotPasswordLink("", userId);

    const parts = url.split("/");
    key = parts[parts.length - 1];

    // make sure you can't login to locked account
    expect(await client.login(email, password)).toEqual({
      data: {
        login: [
          {
            path: "email",
            message: `${forgotPasswordLockedError} - ${reason}`
          }
        ]
      }
    });
  });

  test("changing to a password that's too short", async () => {
    expect(await client.forgotPasswordChange("a", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "newPassword",
            message: passwordNotLongEnough
          }
        ]
      }
    });
  });

  test("changing to a password successfully", async () => {
    const response = await client.forgotPasswordChange(newPassword, key);

    expect(response.data).toEqual({
      forgotPasswordChange: null
    });
  });

  test("make sure redis key expires after password change", async () => {
    expect(await client.forgotPasswordChange("alksdjfalksdjfl", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "key",
            message: expiredKeyError
          }
        ]
      }
    });

    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    });
  });
});
