export const cors = {
  credentials: true,
  origin:
    process.env.NODE_ENV === "test"
      ? "*"
      : (process.env.FRONTEND_HOST as string)
};
