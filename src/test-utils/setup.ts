import { startServer } from "../startServer";
import { AddressInfo } from "net";
import { createTypeormConnection } from "../utils/createTypeormConnection";

export const setup = async () => {
  await createTypeormConnection();
  const app = await startServer();
  const addressData = app.address();
  const port = (addressData! as AddressInfo).port;
  if (port) {
    process.env.TEST_HOST = `http://127.0.0.1:${port}`;
  }
};
