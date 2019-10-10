import "dotenv/config";
import "reflect-metadata";
import { Server } from "http";
import { createTypeormConnection } from "./utils/createTypeormConnection";
import { confirmEmail } from "./routes/confirmEmail";
import { getGraphqlServer } from "./utils/getGraphqlServer";
import { getExpressSession } from "./utils/getExpressSession";
import { getServerPort } from "./utils/getServerPort";
import { cors } from "./cors";

export const startServer = async (): Promise<Server> => {
  console.log("hello");
  const port = getServerPort();
  const server = getGraphqlServer();

  server.express.use(getExpressSession());
  server.express.get("/confirm/:id", confirmEmail);

  await createTypeormConnection();

  const app = await server.start({ port, cors });
  return app;
};
