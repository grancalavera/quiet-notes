import { useEffect } from "react";
import { useErrorHandler } from "../app/app-state";
import { FirebaseError } from "firebase/app";

export interface FirebaseErrorHandlerOptions {
  handleError?: (error: FirebaseError) => void;
}

type FirebaseHookResult<TData> = [TData, boolean, FirebaseError | undefined];

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
