export type Option<T> = Some<T> | None;

interface Some<T> {
  kind: "Some";
  value: T;
}

interface None {
  kind: "None";
}

export const some = <T>(value: T): Option<T> => ({ kind: "Some", value });
export const none = <T = never>(): Option<T> => ({ kind: "None" });

export const isSome = <T>(candidate: Option<T>): candidate is Some<T> => candidate.kind === "Some";
export const isNone = <T>(candidate: Option<T>): candidate is None => candidate.kind === "None";

export const mapOption =
  <T, U>(f: (x: T) => U) =>
  (x: Option<T>): Option<U> =>
    isSome(x) ? some(f(x.value)) : x;

export const mapOption2 =
  <T, U, V>(f: (x: T, y: U) => V) =>
  (x: Option<T>, y: Option<U>): Option<V> => {
    return isSome(x) && isSome(y) ? some(f(x.value, y.value)) : none();
  };

export const fromNullable = <T>(candidate: T | null | undefined): Option<T> =>
  candidate === undefined || candidate === null ? none() : some(candidate);