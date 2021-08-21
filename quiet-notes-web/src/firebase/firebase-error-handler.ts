import firebase from "firebase";
import { useEffect } from "react";
import { useErrorHandler } from "../app/app-state";

type FirebaseHookResult<TData> = [TData, boolean, firebase.FirebaseError | undefined];

export const useFirebaseErrorHandler = <TData>(
  result: FirebaseHookResult<TData>
): FirebaseHookResult<TData> => {
  const [, , error] = result;
  const handleError = useErrorHandler();

  useEffect(() => {
    error && handleError(error);
  }, [error, handleError]);

  return result;
};
