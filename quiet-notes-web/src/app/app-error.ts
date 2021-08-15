import firebase from "firebase";

export type AppError = firebase.FirebaseError | QNError;

export class QNError extends Error {
  public readonly data: any;
  public readonly name: "QNError" = "QNError";

  constructor(message: string, data?: any) {
    super(message);
    this.data = data;
  }
}

export const isFirebaseError = (
  candidate: unknown
): candidate is firebase.FirebaseError =>
  hasErrorName(candidate) && candidate.name === "FirebaseError";

export const isQnError = (candidate: unknown): candidate is QNError =>
  hasErrorName(candidate) && candidate.name === "QNError";

// https://fettblog.eu/typescript-hasownproperty/
function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

const hasErrorName = (candidate: unknown): candidate is { name: string } =>
  typeof candidate === "object" &&
  candidate !== null &&
  hasOwnProperty(candidate, "name");
