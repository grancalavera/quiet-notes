import { useCallback, useState } from "react";
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
  const [result, setResult] = useState<LoadResult<TData>>(idle());

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
