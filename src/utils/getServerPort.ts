const isTesting = process.env.NODE_ENV === "test";

export const getServerPort = () => (isTesting ? 0 : 4000);
