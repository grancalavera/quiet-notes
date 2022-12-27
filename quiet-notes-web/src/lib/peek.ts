import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";

type Transform<T> = (x: T) => unknown;

export const peek = <T>(
  label: string,
  f: Transform<T> = (x) => x
): MonoTypeOperatorFunction<T> =>
  tap<T>((data) => {
    console.log(`${label}`, { data: f(data) });
  });
