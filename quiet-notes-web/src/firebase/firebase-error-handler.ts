import { useEffect } from "react";
import { useErrorHandler } from "../app/app-state";
import { FirebaseError } from "firebase/app";
import { FirebaseHookResult } from "./firebase-hook-result";

export interface FirebaseErrorHandlerOptions {
  handleError?: (error: FirebaseError) => void;
}

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
