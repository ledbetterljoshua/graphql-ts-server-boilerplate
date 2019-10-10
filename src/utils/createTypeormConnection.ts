import { createConnection, getConnectionOptions, Connection } from "typeorm";
import { createTestConn } from "../test-utils/createTestConn";

export const createTypeormConnection = async (): Promise<Connection | null> => {
  if (process.env.NODE_ENV === "test") {
    return createTestConn(true);
  }
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: "default"
  });
};
