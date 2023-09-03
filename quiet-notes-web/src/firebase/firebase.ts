import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { fromFetch } from "rxjs/fetch";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { env } from "../env";

const emulate = env.DEV && env.VITE_FIREBASE_USE_EMULATORS;

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
    if (emulate) {
      connectAuthEmulator(
        getAuth(firebaseApp),
        env.VITE_FIREBASE_EMULATOR_AUTH
      );
    }
  }),
  shareReplay(1)
);

export const auth$ = app$.pipe(map((app) => getAuth(app)));

export const firestore$ = app$.pipe(
  map((app) => {
    const tabManager = persistentMultipleTabManager();
    const localCache = persistentLocalCache({ tabManager });
    const firestore = initializeFirestore(app, { localCache });

    if (emulate) {
      connectFirestoreEmulator(
        firestore,
        "localhost",
        env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT
      );
    }

    return firestore;
  }),
  shareReplay(1)
);

export const functions$ = app$.pipe(
  map((app) => {
    const functions = getFunctions(app);

    if (emulate) {
      connectFunctionsEmulator(
        functions,
        "localhost",
        env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT
      );
    }

    return functions;
  }),
  shareReplay(1)
);
