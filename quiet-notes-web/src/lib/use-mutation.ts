import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useRef } from "react";
import { catchError, from, map, merge, of, startWith, switchMap } from "rxjs";
import { unknownToQNError } from "../app/app-error";
import { AsyncResult, failure, idle, loading, success } from "./async-result";

export type Mutation<TParams = void, TResult = void> = {
  mutate: (params: TParams) => void;
  reset: () => void;
  result: AsyncResult<TResult>;
};

const createMutation = <TParams, TResult>(
  mutationFn: (params: TParams) => Promise<TResult>,
  handleError: (error: unknown) => AsyncResult<TResult>
) => {
  const [mutateSignal$, mutate] = createSignal<TParams>();
  const [resetSignal$, reset] = createSignal();

  const mutation$ = mutateSignal$.pipe(
    switchMap((params) =>
      from(mutationFn(params)).pipe(
        map((result) => success(result)),
        startWith(loading)
      )
    ),
    catchError((error) => of(handleError(error)))
  );

  const reset$ = resetSignal$.pipe(map(() => idle));

  const [useResult] = bind<AsyncResult<TResult>>(
    merge(mutation$, reset$).pipe(startWith(idle))
  );

  return { mutate, reset, useResult };
};

export function useMutation(
  mutationFunction: () => Promise<void>,
  handleError?: (error: unknown) => AsyncResult<void>
): Mutation<void, void>;

export function useMutation<TParams>(
  mutationFunction: (params: TParams) => Promise<void>,
  handleError?: (error: unknown) => AsyncResult<void>
): Mutation<TParams, void>;

export function useMutation<TParams, TResult>(
  mutationFunction: (params: TParams) => Promise<TResult>,
  handleError?: (error: unknown) => AsyncResult<TResult>
): Mutation<TParams, TResult>;

export function useMutation<TParams = void, TResult = void>(
  mutationFunction: (params: TParams) => Promise<TResult>,
  handleError: (error: unknown) => AsyncResult<TResult> = unknownToFailure
): Mutation<TParams, TResult> {
  const { mutate, reset, useResult } = useRef(
    createMutation(mutationFunction, handleError)
  ).current;
  return { result: useResult(), mutate, reset };
}

const unknownToFailure = <T>(error: unknown): AsyncResult<T> =>
  failure(unknownToQNError(error));
