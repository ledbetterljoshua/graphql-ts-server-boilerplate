import { Connection } from "typeorm";
import { User } from "../../../entity/User";
import { TestClient } from "../../../utils/TestClient";
import { createTestConn } from "../../../test-utils/createTestConn";
import {
  userDoesNotExistError,
  postDoesNotExistError
} from "../delete/resolvers";
import { upvoteRemoveSuccessObject, upvoteSuccessObject } from "./resolvers";

let conn: Connection;
const email = "upvotePostTest@bob.com";
const password = "jlkajoioiqwe";
const fakePostId = "0753b019-6006-414a-9c9b-2f7cf7f1b666";

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

describe("upvoting a post", () => {
  test("it fails when there is no user logged in", async () => {
    const response = await client.upvotePost("someId");
    expect(response.data.upvotePost).toEqual([userDoesNotExistError]);
  });

  test("it fails when the post does not exist", async () => {
    await client.login(email, password);
    const response = await client.upvotePost(fakePostId);
    expect(response.data.upvotePost).toEqual([postDoesNotExistError]);
  });

  test("the upvote is removed if this post has already been upvoted by this user", async () => {
    const {
      data: { createPost }
    } = await client.createPost("title", "description");
    const [
      {
        post: { id: postId }
      }
    ] = createPost;
    const response1 = await client.upvotePost(postId);
    expect(response1.data.upvotePost).toEqual([upvoteRemoveSuccessObject]);
    const response2 = await client.upvotePost(postId);
    expect(response2.data.upvotePost).toEqual([upvoteSuccessObject]);
  });
});
