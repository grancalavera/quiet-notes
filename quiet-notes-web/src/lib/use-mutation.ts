import { useCallback, useEffect, useRef, useState } from "react";
import { from, Observable, of } from "rxjs";
import { catchError, map, startWith } from "rxjs/operators";
import { failure, idle, loading, LoadResult, success } from "./load-result";

type MutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<TData>;

type UseMutateFunction<TVariables = unknown> = (variables: TVariables) => void;

interface UseMutationResult<TData = unknown, TVariables = unknown> {
  result: LoadResult<TData>;
  mutate: UseMutateFunction<TVariables>;
  reset: () => void;
}

export function useMutation<TData = unknown, TVariables = void>(
  mutationFn: MutationFunction<TData, TVariables>
): UseMutationResult<TData, TVariables> {
  const isMounted = useRef(false);
  const [result, unsafeSetResult] = useState<LoadResult<TData>>(idle());

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setResult = useCallback((value: LoadResult<TData>) => {
    isMounted.current && unsafeSetResult(value);
  }, []);

  const mutate = useCallback(
    (variables: TVariables) => {
      setResult(loading());

      async function runMutation() {
        try {
          const data = await mutationFn(variables);
          setResult(success(data));
        } catch (error) {
          setResult(failure(error));
        }
      }

      runMutation();
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setResult(idle());
  }, []);

  return { result, mutate, reset };
}
