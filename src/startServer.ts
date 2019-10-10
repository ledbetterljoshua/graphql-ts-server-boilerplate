import "dotenv/config";
import "reflect-metadata";
import { Server } from "http";
import { createTypeormConnection } from "./utils/createTypeormConnection";
import { confirmEmail } from "./routes/confirmEmail";
import { getGraphqlServer } from "./utils/getGraphqlServer";
import { getExpressSession } from "./middleware/getExpressSession";
import { getServerPort } from "./utils/getServerPort";
import { cors } from "./cors";
import { getExpressRateLimit } from "./middleware/getExpressRateLimit";
import { redis } from "./redis";

export const startServer = async (): Promise<Server> => {
  if (process.env.NODE_ENV === "test") {
    await redis.flushall();
  }

  const port = getServerPort();
  const server = getGraphqlServer();

  server.express.use(getExpressSession());
  server.express.use(getExpressRateLimit());

  server.express.get("/confirm/:id", confirmEmail);

  await createTypeormConnection();

  const app = await server.start({ port, cors });
  return app;
};
