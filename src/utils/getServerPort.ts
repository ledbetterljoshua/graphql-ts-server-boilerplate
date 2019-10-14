const isTesting = process.env.NODE_ENV === "test";
const port = process.env.PORT || 4000;

export const getServerPort = () => (isTesting ? 0 : port);
