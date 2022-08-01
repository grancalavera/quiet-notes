import { Observable, of, OperatorFunction } from "rxjs";
import { mapOption, none, Option, some } from "./option";

export const mapOption$ =
  <T, U>(f: (x: T) => U): OperatorFunction<Option<T>, Option<U>> =>
  (source$) => {
    const map = mapOption(f);

    return new Observable((subscriber) => {
      const subscription = source$.subscribe({
        next: (x) => subscriber.next(map(x)),
        error: subscriber.error,
        complete: subscriber.complete,
      });

      return subscription.unsubscribe;
    });
  };

export const ofNone = <T = never>(): Observable<Option<T>> => of(none());

export const ofSome = <T>(x: T): Observable<Option<T>> => of(some(x));
