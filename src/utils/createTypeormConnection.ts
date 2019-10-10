import { createConnection, getConnectionOptions, Connection } from "typeorm";

export const createTypeormConnection = async (): Promise<Connection | null> => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: "default"
  });
};
