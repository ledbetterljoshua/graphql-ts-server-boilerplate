import { User } from "../../../entity/User";
import { errorMessages } from "./constants";
import { Connection } from "typeorm";
import { createTestConn } from "../../../test-utils/createTestConn";
import { TestClient } from "../../../utils/testClient";

const {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} = errorMessages;

const email = "test2@gmail.com";
const password = "YouHaveNoPowerHere";

const client = new TestClient();

let conn: Connection;
beforeAll(async () => {
  conn = await createTestConn();
});
afterAll(async () => {
  conn.close();
});

describe("A register mutation", () => {
  it("should register a valid user", async () => {
    const response = await client.register(email, password);
    expect(response.data).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    expect(users[0].email).toEqual(email);
    expect(users[0].password).not.toEqual(password);
  });

  it("should not register a duplicate user", async () => {
    const response: any = await client.register(email, password);
    expect(response.data.register).toHaveLength(1);
    expect(response.data.register[0].path).toEqual("email");
    expect(response.data.register[0].message).toEqual(duplicateEmail);
  });

  it("should not register a user with an invalid email", async () => {
    const response: any = await client.register("a", password);
    expect(response.data.register).toHaveLength(2);

    expect(response.data.register).toEqual([
      {
        message: emailNotLongEnough,
        path: "email"
      },
      {
        message: invalidEmail,
        path: "email"
      }
    ]);
  });

  it("should not register a user with an invalid password", async () => {
    const response: any = await client.register(email, "a");
    expect(response.data.register).toHaveLength(1);

    expect(response.data.register).toEqual([
      {
        message: passwordNotLongEnough,
        path: "password"
      }
    ]);
  });

  it("should not register a user with an invalid password and invalid email", async () => {
    const response: any = await client.register("a", "a");
    expect(response.data.register).toHaveLength(3);

    expect(response.data.register).toEqual([
      {
        message: emailNotLongEnough,
        path: "email"
      },
      {
        message: invalidEmail,
        path: "email"
      },
      {
        message: passwordNotLongEnough,
        path: "password"
      }
    ]);
  });
});
