import firebase from "firebase";
import { useCallback, useState } from "react";

interface FirebaseMutation<TVariables = unknown, TData = unknown> {
  data: TData | undefined;
  state: "idle" | "loading" | "success" | "failure";
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  reset: () => void;
}

interface FirebaseMutationOptions {
  onError?: (e: firebase.FirebaseError) => void;
}

export const useFirebaseMutation = <TVariables = unknown, TData = unknown>(
  mutationFn: (x: TVariables) => Promise<TData>,
  options: FirebaseMutationOptions = {}
): FirebaseMutation<TVariables, TData> => {
  const [state, setState] = useState<FirebaseMutation["state"]>("idle");
  const [data, setData] = useState<TData>();
  const { onError } = options;

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState("loading");

      try {
        const result = await mutationFn(variables);
        setData(result);
        setState("success");
        return result;
      } catch (e) {
        setState("failure");
        if (onError) {
          onError(e);
        } else {
          throw e;
        }
      }
    },

    [mutationFn, onError]
  );

  const reset = useCallback(() => {
    setState("idle");
    setData(undefined);
  }, []);

  return { data, state, mutate, reset };
};
