import "dotenv/config";
import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createTypeormConnection } from "./utils/createTypeormConnection";
import { Server } from "http";
import { getSchemas } from "./utils/getGraphqlSchemas";
import { confirmEmail } from "./routes/confirmEmail";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { redis } from "./redis";
import { redisSessionPrefix } from "./constants";

const RedisStore = connectRedis(session);

export const startServer = async (): Promise<Server> => {
  const isTesting = process.env.NODE_ENV === "test";

  const schemas = getSchemas();
  const server = new GraphQLServer({
    schema: schemas,
    context: ({ request }) => {
      return {
        url: `${request.protocol}://${request.get("host")}`,
        session: request.session,
        sessionID: request.sessionID
      };
    }
  });
  const port = isTesting ? 0 : 4000;

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      name: "qid",
      secret: process.env.USER_SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const cors = {
    credentials: true,
    origin:
      process.env.NODE_ENV === "test"
        ? "*"
        : (process.env.FRONTEND_HOST as string)
  };

  server.express.get("/confirm/:id", confirmEmail);

  if (!isTesting) {
    await createTypeormConnection();
  }

  const app = await server.start({ port, cors });

  return app;
};
