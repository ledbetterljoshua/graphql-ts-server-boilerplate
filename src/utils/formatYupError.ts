import { ValidationError } from "yup";

type Error = {
  path: string;
  message: string;
};

export const formatYupError = (err: ValidationError): Error[] => {
  const errors: Array<Error> = [];
  err.inner.forEach(e => {
    const { path, message } = e;
    errors.push({ path, message });
  });
  return errors;
};
