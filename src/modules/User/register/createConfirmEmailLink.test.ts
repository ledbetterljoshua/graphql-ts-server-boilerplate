import fetch from "node-fetch";

import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { User } from "../../../entity/User";
// import { createTypeormConnection } from "./createTypeormConnection";
import { redis } from "../../../redis";
import { Connection } from "typeorm";
import { createTestConn } from "../../../test-utils/createTestConn";

let userId = "";

let conn: Connection;
beforeAll(async () => {
  conn = await createTestConn();
  const user = await User.create({
    email: "bob4@bob.com",
    password: "jlkajoioiqwe"
  }).save();
  userId = user.id;
});
afterAll(async () => {
  await conn.close();
});

const HOST = process.env.TEST_HOST as string;

describe("test createConfirmEmailLink", () => {
  test("Make sure it confirms user and clears key in redis", async () => {
    const url = await createConfirmEmailLink(HOST, userId);
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("ok");
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });
});
