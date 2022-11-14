import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { scan, startWith } from "rxjs";
import { assertNever } from "../lib/assert-never";
import { AppError, errorFromUnknown } from "./app-error";

type ErrorState = AppError[];
type ErrorSignal = HandleError | DismissError;

interface HandleError {
  kind: "HandleError";
  error: AppError;
}

interface DismissError {
  kind: "DismissError";
}

const [errorSignal$, sendErrorSignal] = createSignal<ErrorSignal>();

export const handleError = (error: AppError) => sendErrorSignal({ kind: "HandleError", error });
export const handleUnknownError = (error: unknown) => handleError(errorFromUnknown(error));
export const dismissError = () => sendErrorSignal({ kind: "DismissError" });

const defaultState:ErrorState = [];

export const [useAppErrors, appErrors$] = bind<ErrorState>(
  errorSignal$.pipe(
    scan((errors, signal) => {
      switch (signal.kind) {
        case "HandleError":
          return [...errors, signal.error];
        case "DismissError":
          return errors.slice(1);
        default:
          return assertNever(signal);
      }
    }, defaultState),
    startWith(defaultState)
  )
);
