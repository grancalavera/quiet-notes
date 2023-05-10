export type AsyncResult<T> = Failure | Success<T> | Idle | Loading;

type Idle = {
  kind: "AsyncIdle";
};

type Loading = {
  kind: "AsyncLoading";
};

type Success<T> = {
  kind: "AsyncSuccess";
  value: T;
};

type Failure = {
  kind: "AsyncFailure";
  error: Error;
};

export function success(): AsyncResult<void>;
export function success<T>(value: T): AsyncResult<T>;
export function success<T = void>(value?: T): AsyncResult<T | void> {
  return { kind: "AsyncSuccess", value };
}

export function failure<T>(error: Error): AsyncResult<T> {
  return { kind: "AsyncFailure", error };
}

export const isFailure = <T>(candidate: AsyncResult<T>): candidate is Failure =>
  candidate.kind === "AsyncFailure";

export const isSuccess = <T>(
  candidate: AsyncResult<T>
): candidate is Success<T> => candidate.kind === "AsyncSuccess";

export const idle: Idle = { kind: "AsyncIdle" };

export const isIdle = <T>(candidate: AsyncResult<T>): candidate is Idle =>
  candidate.kind === "AsyncIdle";

export const isLoading = <T>(candidate: AsyncResult<T>): candidate is Loading =>
  candidate.kind === "AsyncLoading";

export const loading: Loading = { kind: "AsyncLoading" };
