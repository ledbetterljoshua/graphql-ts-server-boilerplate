import * as path from "path";
import * as fs from "fs";
import { importSchema } from "graphql-import";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { GraphQLSchema } from "graphql";

export const getSchemas = () => {
  const schemas: GraphQLSchema[] = [];

  const folders = fs.readdirSync(path.join(__dirname, "../modules"));
  folders.forEach(folder => {
    const { resolvers } = require(`../modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `../modules/${folder}/schema.graphql`)
    );
    schemas.push(
      makeExecutableSchema({
        resolvers,
        typeDefs
      })
    );
  });

  return mergeSchemas({ schemas });
};
