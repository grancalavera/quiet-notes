import { FirebaseError } from "firebase/app";
import { hasOwnProperty } from "../lib/has-property";

export type AppError = FirebaseError | QNError;

export class QNError extends Error {
  public readonly data: unknown;
  public readonly name: "QNError" = "QNError";

  constructor(message: string, data?: unknown) {
    super(message);
    this.data = data;
  }
}

export const isFirebaseError = (
  candidate: unknown
): candidate is FirebaseError =>
  hasErrorName(candidate) && candidate.name === "FirebaseError";

export const isPermissionDeniedError = (
  candidate: unknown
): candidate is FirebaseError =>
  isFirebaseError(candidate) && candidate.code === "permission-denied";

export const isQnError = (candidate: unknown): candidate is QNError =>
  hasErrorName(candidate) && candidate.name === "QNError";

const hasErrorName = (candidate: unknown): candidate is { name: string } =>
  hasOwnProperty(candidate, "name");

// https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
export const unknownToQNError = (unsafe_error: unknown): QNError => {
  const error = unknownToError(unsafe_error);
  return new QNError(error.message, unsafe_error);
};

export const unknownToError = (unsafe_error: unknown): Error => {
  if (unsafe_error instanceof Error) {
    return unsafe_error;
  }

  if (
    hasOwnProperty(unsafe_error, "message") &&
    typeof unsafe_error.message === "string"
  ) {
    return new Error(unsafe_error.message);
  }

  if (typeof unsafe_error === "string") {
    return new Error(unsafe_error);
  }

  return new Error("Unknown error");
};
