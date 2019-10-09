import { User } from "../../entity/User";
import { Connection } from "typeorm";
import { createTestConn } from "../../test-utils/createTestConn";
import request from "graphql-request";
import { errorMessages } from "./constants";

const email = "Joshua@gmail.com";
const password = "HAHAHAHAH";

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const HOST = process.env.TEST_HOST as string;

let conn: Connection;
beforeAll(async () => {
  conn = await createTestConn();
  await request(HOST, registerMutation(email, password));
});

afterAll(async () => {
  conn.close();
});

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response = await request(HOST, loginMutation(e, p));

  expect(response).toEqual({
    login: [
      {
        path: "email",
        message: errMsg
      }
    ]
  });
};

describe("Login", () => {
  test("email not found", async () => {
    await loginExpectError(
      "bad@email.com",
      "whatever",
      errorMessages.invalidLogin
    );
  });
  test("has an invalid password", async () => {
    await loginExpectError(email, "aslkdfjaksdljf", errorMessages.invalidLogin);
  });
  test("email not confirmed", async () => {
    await loginExpectError(email, password, errorMessages.confirmEmail);
  });
  test("confirms email and logs in", async () => {
    await User.update({ email }, { confirmed: true });
    const response = await request(HOST, loginMutation(email, password));
    expect(response).toEqual({ login: null });
  });
});
