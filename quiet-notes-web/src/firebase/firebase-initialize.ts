import firebase from "firebase/app";

import { useEffect, useState } from "react";

const env = import.meta.env;
const isDev = env.DEV;
const emulate = env.VITE_FIREBASE_USE_EMULATORS === "true";

const initializeFirebase = async (onInitialized: () => void) => {
  if (firebase.apps.length === 0) {
    const response = await fetch("/__/firebase/init.json");
    const config = await response.json();
    firebase.initializeApp(config);
  }

  if (isDev && emulate) {
    firebase.auth().useEmulator(env.VITE_FIREBASE_EMULATOR_AUTH);

    firebase
      .firestore()
      .useEmulator("localhost", parseInt(env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT));

    firebase
      .functions()
      .useEmulator("localhost", parseInt(env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT));
  }

  onInitialized();
};

export const useInitializeFirebase = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeFirebase(() => setReady(true));
  }, []);

  return ready;
};
