import { generateNamespace } from "@gql2ts/from-schema";
import { writeFile } from "fs";
import { join } from "path";

import { getSchemas } from "../utils/getGraphqlSchemas";

const schemas = getSchemas();

const types = generateNamespace("GQL", schemas);

writeFile(join(__dirname, "../types/schema.d.ts"), types, err => {
  console.log(err);
  process.exit();
});
