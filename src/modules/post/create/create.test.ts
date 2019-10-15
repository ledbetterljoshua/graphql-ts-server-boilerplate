import { Connection } from "typeorm";
import { User } from "../../../entity/User";
import { TestClient } from "../../../utils/TestClient";
import { createTestConn } from "../../../test-utils/createTestConn";
import { notAuthenticatedError } from "./resolvers";

let conn: Connection;
const email = "createPostTest@bob.com";
const password = "jlkajoioiqwe";

const client = new TestClient();

beforeAll(async () => {
  conn = await createTestConn();
  await User.create({
    email,
    password,
    confirmed: true
  }).save();
});

afterAll(async () => {
  await conn.close();
});

describe("create post", () => {
  test("should fail with no logged in user", async () => {
    const response = await client.createPost("title", "description");
    expect(response.data.createPost).toEqual([notAuthenticatedError]);
  });

  test("should create post with logged in user", async () => {
    await client.login(email, password);
    const response = await client.createPost("title", "description");
    expect(response.data.createPost[0].post).toHaveProperty("id");
  });
});
