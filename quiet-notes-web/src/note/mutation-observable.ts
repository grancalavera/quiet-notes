import { from, Observable, of } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { failure, idle, loading, LoadResult, success } from "../lib/load-result";

type MutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<TData>;

export const createMutation$ = <TData = unknown, TVariables = void>(
  variables$: Observable<TVariables>,
  mutationFn: MutationFunction<TData, TVariables>
): Observable<LoadResult<TData>> =>
  variables$.pipe(
    switchMap((variables) =>
      from(mutationFn(variables)).pipe(
        map((data) => success<TData>(data)),
        catchError((error) => of(failure<TData>(error))),
        startWith(loading<TData>())
      )
    ),
    startWith(idle<TData>())
  );
