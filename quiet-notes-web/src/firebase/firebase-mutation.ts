import firebase from "firebase";
import { useCallback, useState } from "react";

interface FirebaseMutation<TVariables = unknown, TData = unknown> {
  data: TData | undefined;
  state: "idle" | "loading" | "success" | "failure";
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  reset: () => void;
}

export const useFirebaseMutation = <TVariables, TData>(
  mutationFn: (x: TVariables) => Promise<TData>,
  handleError?: (e: firebase.FirebaseError) => void
): FirebaseMutation<TVariables, TData> => {
  const [state, setState] = useState<FirebaseMutation["state"]>("idle");
  const [data, setData] = useState<TData>();

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
        if (handleError) {
          handleError(e);
        } else {
          throw e;
        }
      }
    },

    [mutationFn, handleError]
  );

  const reset = useCallback(() => {
    setState("idle");
    setData(undefined);
  }, []);

  return { data, state, mutate, reset };
};
