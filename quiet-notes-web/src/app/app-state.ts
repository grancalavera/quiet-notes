import { useCallback } from "react";
import create, { State } from "zustand";
import { AppError, errorFromUnknown, QNError } from "./app-error";

interface AppState extends State {
  errors: AppError[];
  handleError: (error: AppError) => void;
  dismissError: () => void;
}

export const useAppState = create<AppState>((set) => ({
  errors: [],
  handleError: (error) => set(({ errors }) => ({ errors: [...errors, error] })),
  dismissError: () => set(({ errors }) => ({ errors: errors.slice(1) })),
}));

const selectHandleError = (s: AppState) => s.handleError;

export const useErrorHandler = () => useAppState(selectHandleError);

export const useUnknownErrorHandler = () => {
  const handleError = useErrorHandler();
  return useCallback(
    (error: unknown) => {
      handleError(errorFromUnknown(error));
    },
    [handleError]
  );
};

export const useNotImplementedError = () => {
  const handleError = useErrorHandler();

  return useCallback(
    (featureName: string) => {
      handleError(new QNError(`${featureName} not implemented`));
    },
    [handleError]
  );
};
