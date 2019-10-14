import { GraphQLServer } from "graphql-yoga";
import { getSchemas } from "./getGraphqlSchemas";
import { getViewerFromSession } from "./getViewerFromSession";

const schemas = getSchemas();
export const getGraphqlServer = () =>
  new GraphQLServer({
    schema: schemas,
    context: async ({ request }) => {
      const viewer = await getViewerFromSession(request!.session!);
      return {
        url: `${request.protocol}://${request.get("host")}`,
        session: request.session,
        sessionID: request.sessionID,
        viewer
      };
    }
  });
