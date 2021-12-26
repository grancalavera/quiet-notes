import firebase from "firebase/app";
import { fromFetch } from "rxjs/fetch";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";

const env = import.meta.env;
const isDev = env.DEV;
const emulate = env.VITE_FIREBASE_USE_EMULATORS === "true";

export const firebase$ = fromFetch("/__/firebase/init.json").pipe(
  switchMap((response) => {
    if (response.ok) {
      return response.json();
    } else {
      const e = new Error("Failed to fetch firebase configuration");
      e.name = response.status.toString();
      throw e;
    }
  }),
  tap((config) => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);

      if (isDev && emulate) {
        firebase.auth().useEmulator(env.VITE_FIREBASE_EMULATOR_AUTH);

        firebase
          .firestore()
          .useEmulator("localhost", parseInt(env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT));

        firebase
          .functions()
          .useEmulator("localhost", parseInt(env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT));
      }
    }
  }),
  map(() => {}),
  shareReplay(1)
);
