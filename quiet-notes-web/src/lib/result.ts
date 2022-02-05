export type Result<T> = Failure | Success<T>;

export interface Success<T> {
  kind: "Success";
  value: T;
}

export interface Failure {
  kind: "Failure";
  error: any;
}

export function success(): Result<void>;
export function success<T>(value: T): Result<T>;
export function success<T>(value?: T): Result<T | void> {
  return { kind: "Success", value };
}

export function failure<T>(): Result<T>;
export function failure<T>(error: any): Result<T>;
export function failure<T>(error?: any): Result<T> {
  return { kind: "Failure", error };
}

export const isFailure = <T>(candidate: Result<T>): candidate is Failure =>
  candidate.kind === "Failure";

export const isSuccess = <T>(candidate: Result<T>): candidate is Success<T> =>
  candidate.kind === "Success";
