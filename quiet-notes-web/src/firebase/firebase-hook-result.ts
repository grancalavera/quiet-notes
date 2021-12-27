import { FirebaseError } from "firebase/app";

export type FirebaseHookResult<TData> = [TData, boolean, FirebaseError | undefined];
