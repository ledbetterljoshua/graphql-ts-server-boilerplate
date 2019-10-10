import { User } from "../../../entity/User";
import { Connection } from "typeorm";
import { TestClient } from "../../../utils/TestClient";
import { createTestConn } from "../../../test-utils/createTestConn";

let conn: Connection;
const email = "bob2@bob.com";
const password = "jlkajoioiqwe";

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

describe("logout", () => {
  test("multiple sessions", async () => {
    // computer 1
    const sess1 = new TestClient();
    // computer 2
    const sess2 = new TestClient();

    await sess1.login(email, password);
    await sess2.login(email, password);
    expect(await sess1.me()).toEqual(await sess2.me());
    await sess1.logout();
    const loggedOutSession = await sess1.me();
    expect(loggedOutSession.data.me).toBeNull();
    expect(loggedOutSession).toEqual(await sess2.me());
  });

  test("single session", async () => {
    const client = new TestClient();

    await client.login(email, password);

    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });

    await client.logout();

    const response2 = await client.me();

    expect(response2.data.me).toBeNull();
  });
});
