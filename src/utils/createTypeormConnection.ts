import { createConnection, getConnectionOptions, Connection } from "typeorm";
import { createTestConn } from "../test-utils/createTestConn";
import { User } from "../entity/User";

const { NODE_ENV, DATABASE_URL } = process.env;

const isProd = NODE_ENV === "production";
const isTesting = NODE_ENV === "test";

export const createTypeormConnection = async (): Promise<Connection | null> => {
  if (isTesting) {
    return createTestConn(true);
  }
  const initialOptions = await getConnectionOptions(process.env.NODE_ENV);
  const defaultConnectionOptions = { ...initialOptions, name: "default" };
  const connectionOptions = isProd
    ? { ...defaultConnectionOptions, url: DATABASE_URL, entities: [User] }
    : defaultConnectionOptions;

  return createConnection({
    ...connectionOptions
  } as any);
};
