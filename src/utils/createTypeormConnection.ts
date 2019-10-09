import { createConnection, getConnectionOptions, Connection } from "typeorm";

export const createTypeormConnection = async (): Promise<Connection> => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return await createConnection({
    ...connectionOptions,
    name: "default"
  });
};
