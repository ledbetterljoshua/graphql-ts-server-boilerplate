import { request } from "graphql-request";
import { User } from "../../entity/User";
import { errorMessages } from "./constants";
// import { createTypeormConnection } from "../../utils/createTypeormConnection";
import { Connection } from "typeorm";
import { createTestConn } from "../../test-utils/createTestConn";

const {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} = errorMessages;

const email = "test2@gmail.com";
const password = "YouHaveNoPowerHere";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const HOST = process.env.TEST_HOST as string;

let conn: Connection;
beforeAll(async () => {
  conn = await createTestConn();
});
afterAll(async () => {
  conn.close();
});

describe("A register mutation", () => {
  it("should register a valid user", async () => {
    const response = await request(HOST, mutation(email, password));
    expect(response).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    expect(users[0].email).toEqual(email);
    expect(users[0].password).not.toEqual(password);
  });

  it("should not register a duplicate user", async () => {
    const response: any = await request(HOST, mutation(email, password));
    expect(response.register).toHaveLength(1);
    expect(response.register[0].path).toEqual("email");
    expect(response.register[0].message).toEqual(duplicateEmail);
  });

  it("should not register a user with an invalid email", async () => {
    const response: any = await request(HOST, mutation("a", password));
    expect(response.register).toHaveLength(2);

    expect(response.register).toEqual([
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
    const response: any = await request(HOST, mutation(email, "a"));
    expect(response.register).toHaveLength(1);

    expect(response.register).toEqual([
      {
        message: passwordNotLongEnough,
        path: "password"
      }
    ]);
  });

  it("should not register a user with an invalid password and invalid email", async () => {
    const response: any = await request(HOST, mutation("a", "a"));
    expect(response.register).toHaveLength(3);

    expect(response.register).toEqual([
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
