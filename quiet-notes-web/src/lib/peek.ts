import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";

type Transform<T> = (x: T) => unknown;

export const peek = <T>(label: string, f: Transform<T> = (x) => x): MonoTypeOperatorFunction<T> =>
  tap<T>((data) => {
    console.log(`[${label}]`, { data: f(data) });
  });

export const peekStart = <T>(
  groupName: string,
  f: Transform<T> = (x) => x
): MonoTypeOperatorFunction<T> =>
  tap<T>((data) => {
    console.group(`[${groupName}]`);
    console.log("[enter]", { data: f(data) });
  });

export const peekEnd = <T>(f: Transform<T> = (x) => x): MonoTypeOperatorFunction<T> =>
  tap<T>((data) => {
    console.log("[exit]", { data: f(data) });
    console.groupEnd();
  });
