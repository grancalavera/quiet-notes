import firebase from "firebase/compat/app";
import { useEffect } from "react";
import { useErrorHandler } from "../app/app-state";

export interface FirebaseErrorHandlerOptions {
  handleError?: (error: firebase.FirebaseError) => void;
}

type FirebaseHookResult<TData> = [TData, boolean, firebase.FirebaseError | undefined];

export const useFirebaseErrorHandler = <TData>(
  result: FirebaseHookResult<TData>,
  options: FirebaseErrorHandlerOptions = {}
): FirebaseHookResult<TData> => {
  const [, , error] = result;
  const defaultErrorHandler = useErrorHandler();

  useEffect(() => {
    const handleError = options.handleError ?? defaultErrorHandler;
    error && handleError(error);
  }, [error, defaultErrorHandler, options.handleError]);

  return result;
};
