import { from, Observable, of } from "rxjs";
import { catchError, exhaustMap, map, startWith } from "rxjs/operators";
import { failure, idle, loading, LoadResult, success } from "../lib/load-result";
import { peek, peekEnd, peekStart } from "../lib/peek";

type MutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<TData>;

export const createMutation$ = <TData = unknown, TVariables = void>(
  variables$: Observable<TVariables>,
  mutationFn: MutationFunction<TData, TVariables>
): Observable<LoadResult<TData>> =>
  variables$.pipe(
    peekStart("mutation requested"),
    exhaustMap((variables) =>
      from(mutationFn(variables)).pipe(
        peek("mutation acknowledged"),
        map((data) => success<TData>(data)),
        catchError((error) => of(failure<TData>(error))),
        startWith(loading<TData>())
      )
    ),
    startWith(idle<TData>()),
    peekEnd()
  );
