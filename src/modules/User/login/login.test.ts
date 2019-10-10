import { User } from "../../../entity/User";
import { Connection } from "typeorm";
import { createTestConn } from "../../../test-utils/createTestConn";
import { TestClient } from "../../../utils/TestClient";
import { invalidLogin, confirmEmailAddress } from "../shared/errorMessages";

const email = "Joshua@gmail.com";
const password = "HAHAHAHAH";

let conn: Connection;
beforeAll(async () => {
  const client = new TestClient();
  conn = await createTestConn();
  await client.register(email, password);
});

afterAll(async () => {
  await conn.close();
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
    await loginExpectError(client, "bad@email.com", "whatever", invalidLogin);
  });
  test("has an invalid password", async () => {
    const client = new TestClient();
    await loginExpectError(client, email, "aslkdfjaksdljf", invalidLogin);
  });
  test("email not confirmed", async () => {
    const client = new TestClient();
    await loginExpectError(client, email, password, confirmEmailAddress);
  });
  test("confirms email and logs in", async () => {
    await User.update({ email }, { confirmed: true });
    const client = new TestClient();
    const response = await client.login(email, password);
    expect(response.data).toEqual({ login: null });
  });
});
