import { Result } from "./result";
export * from "./result";

export type LoadResult<T> = Idle | Loading | Result<T>;

interface Idle {
  kind: "Idle";
}

interface Loading {
  kind: "Loading";
}

const IDLE: Idle = { kind: "Idle" };
const LOADING: Loading = { kind: "Loading" };

export const idle = <T = void>(): LoadResult<T> => IDLE;
export const loading = <T = void>(): LoadResult<T> => LOADING;

export const isIdle = <T>(candidate: LoadResult<T>): candidate is Idle =>
  candidate.kind === "Idle";

export const isLoading = <T>(candidate: LoadResult<T>): candidate is Loading =>
  candidate.kind === "Loading";
