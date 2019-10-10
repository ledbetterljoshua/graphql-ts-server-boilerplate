import { ValidationError } from "yup";

interface Error {
  path: string;
  message: string;
  extra?: string;
}

export const formatYupError = (err: ValidationError): Error[] => {
  const errors: Error[] = [];
  err.inner.forEach(e => {
    const { path, message } = e;
    errors.push({ path, message });
  });
  return errors;
};
