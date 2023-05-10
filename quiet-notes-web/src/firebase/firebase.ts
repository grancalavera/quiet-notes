import { bind } from "@react-rxjs/core";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { fromFetch } from "rxjs/fetch";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { env } from "../env";

const isDev = env.DEV;
const emulate = env.VITE_FIREBASE_USE_EMULATORS === "true";

export const app$ = fromFetch("/__/firebase/init.json").pipe(
  switchMap((response) => {
    if (response.ok) {
      return response.json();
    } else {
      const e = new Error("Failed to fetch firebase configuration");
      e.name = response.status.toString();
      throw e;
    }
  }),
  map((config) => initializeApp(config)),
  tap((firebaseApp) => {
    if (isDev && emulate) {
      connectAuthEmulator(
        getAuth(firebaseApp),
        env.VITE_FIREBASE_EMULATOR_AUTH
      );

      connectFirestoreEmulator(
        getFirestore(firebaseApp),
        "localhost",
        parseInt(env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT)
      );

      connectFunctionsEmulator(
        getFunctions(firebaseApp),
        "localhost",
        parseInt(env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT)
      );
    }
  }),
  shareReplay(1)
);

export const auth$ = app$.pipe(map((app) => getAuth(app)));
export const firestore$ = app$.pipe(map((app) => getFirestore(app)));
export const functions$ = app$.pipe(map((app) => getFunctions(app)));
export const [useFunctions] = bind(functions$);
