import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { AppError, errorFromUnknown, QNError } from "./app-error";

const [dispatchErrorsSignal$, dispatchErrors] = createSignal<AppError[]>();

export const [useAppErrors] = bind(dispatchErrorsSignal$, []);

export const useErrorHandler = () => {
  const errors = useAppErrors();
  return useCallback(
    (error: AppError) => {
      const handled = [...errors, error];
      dispatchErrors(handled);
    },
    [errors]
  );
};

export const useDismissError = () => {
  const errors = useAppErrors();

  return useCallback(() => {
    const handled = errors.slice(1);
    dispatchErrors(handled);
  }, [errors]);
};

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
