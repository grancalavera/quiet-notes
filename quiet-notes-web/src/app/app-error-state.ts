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

const [signal$, send] = createSignal<ErrorSignal>();

export const handleError = (error: AppError): void => {
  send({ kind: "HandleError", error });
};

export const handleUnknownError = (error: unknown): void => {
  handleError(errorFromUnknown(error));
};

export const dismissError = (): void => {
  send({ kind: "DismissError" });
};

const defaultState: ErrorState = [];

export const [useAppErrors, appErrors$] = bind<ErrorState>(
  signal$.pipe(
    scan((state, signal) => {
      switch (signal.kind) {
        case "HandleError":
          return [...state, signal.error];
        case "DismissError":
          return state.slice(1);
        default:
          assertNever(signal);
      }
    }, defaultState),
    startWith(defaultState)
  )
);
