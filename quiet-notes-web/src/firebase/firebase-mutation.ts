import firebase from "firebase/compat/app";
import { useCallback, useState } from "react";
import { isFirebaseError } from "../app/app-error";

interface FirebaseMutation<TVariables = unknown, TData = unknown> {
  data: TData | undefined;
  status: "idle" | "loading" | "success" | "failure";
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
  const [status, setState] = useState<FirebaseMutation["status"]>("idle");
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
      } catch (error) {
        setState("failure");
        if (onError && isFirebaseError(error)) {
          onError(error);
        } else {
          throw error;
        }
      }
    },

    [mutationFn, onError]
  );

  const reset = useCallback(() => {
    setState("idle");
    setData(undefined);
  }, []);

  return { data, status, mutate, reset };
};
