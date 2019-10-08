import { GraphQLServer } from "graphql-yoga";
import { createTypeormConnection } from "./utils/createTypeormConnection";
import { Server } from "http";
import { getSchemas } from "./utils/getGraphqlSchemas";
import { confirmEmail } from "./routes/confirmEmail";
// import { createTestConn } from "./test-utils/createTestConn";

export const startServer = async (): Promise<Server> => {
  const isTesting = process.env.NODE_ENV === "test";

  const schemas = getSchemas();
  const server = new GraphQLServer({
    schema: schemas,
    context: ({ request }) => ({
      url: `${request.protocol}://${request.get("host")}`
    })
  });
  const port = isTesting ? 0 : 4000;
  server.express.get("/confirm/:id", confirmEmail);

  if (!isTesting) {
    await createTypeormConnection();
  }

  const app = await server.start({ port });

  console.log(`Server is running on localhost:${port}`);
  return app;
};
