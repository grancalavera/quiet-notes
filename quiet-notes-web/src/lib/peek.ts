import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";

export const peek = <T>(label: string): MonoTypeOperatorFunction<T> =>
  tap<T>((data) => console.log(`[peek] ${label}`, { data }));

export const peekEnter = <T>(label: string): MonoTypeOperatorFunction<T> =>
  peek(`[enter] ${label}`);

export const peekExit = <T>(label: string): MonoTypeOperatorFunction<T> =>
  peek(`[exit] ${label}`);
