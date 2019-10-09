import { User } from "../../../entity/User";
import { Connection } from "typeorm";
import { createTestConn } from "../../../test-utils/createTestConn";
import { errorMessages } from "./constants";
import { TestClient } from "../../../utils/TestClient";

const email = "Joshua@gmail.com";
const password = "HAHAHAHAH";

let conn: Connection;
beforeAll(async () => {
  const client = new TestClient();
  conn = await createTestConn();
  await client.register(email, password);
});

afterAll(async () => {
  conn.close();
});

const loginExpectError = async (
  client: TestClient,
  e: string,
  p: string,
  errMsg: string
) => {
  const response = await client.login(e, p);

  expect(response.data).toEqual({
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
    const client = new TestClient();
    await loginExpectError(
      client,
      "bad@email.com",
      "whatever",
      errorMessages.invalidLogin
    );
  });
  test("has an invalid password", async () => {
    const client = new TestClient();
    await loginExpectError(
      client,
      email,
      "aslkdfjaksdljf",
      errorMessages.invalidLogin
    );
  });
  test("email not confirmed", async () => {
    const client = new TestClient();
    await loginExpectError(client, email, password, errorMessages.confirmEmail);
  });
  test("confirms email and logs in", async () => {
    await User.update({ email }, { confirmed: true });
    const client = new TestClient();
    const response = await client.login(email, password);
    expect(response.data).toEqual({ login: null });
  });
});
