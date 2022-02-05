import { Observable, of } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { failure, idle, loading, LoadResult, success } from "./load-result";

export type LoadResultObservable<T> = Observable<LoadResult<T>>;

export function ofSuccess(): LoadResultObservable<void>;
export function ofSuccess<T>(): LoadResultObservable<T>;
export function ofSuccess<T>(value?: T): LoadResultObservable<T | void> {
  const result = value === undefined ? success() : success(value);
  return of(result);
}

export function ofFailure<T = void>(): LoadResultObservable<T>;
export function ofFailure<T = void>(error: any): LoadResultObservable<T>;
export function ofFailure<T = void>(error?: any): LoadResultObservable<T> {
  const result = failure<T>(error);
  return of(result);
}

export interface CreateLoadResultOptions<TInput, TResult> {
  input$: Observable<TInput>;
  loadResult: (input: TInput) => Observable<TResult>;
}

export const createLoadResult = <TInput, TResult>({
  input$,
  loadResult: computeResult,
}: CreateLoadResultOptions<TInput, TResult>): LoadResultObservable<TResult> =>
  input$.pipe(
    switchMap((input) =>
      computeResult(input).pipe(
        map((result) => success<TResult>(result)),
        catchError((error) => ofFailure<TResult>(error)),
        startWith(loading<TResult>())
      )
    ),
    startWith(idle<TResult>())
  );
