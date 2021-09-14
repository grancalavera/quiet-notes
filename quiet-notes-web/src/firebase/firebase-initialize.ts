import firebase from "firebase/app";

import { useEffect, useState } from "react";

const initializeFirebase = async (onInitialized: () => void) => {
  if (firebase.apps.length === 0) {
    const response = await fetch("/__/firebase/init.json");
    const config = await response.json();
    firebase.initializeApp(config);
  }

  const isDev = process.env.NODE_ENV === "development";
  const emulate = process.env.REACT_APP_FIREBASE_USE_EMULATORS === "true";

  if (isDev && emulate) {
    firebase.auth().useEmulator(process.env.REACT_APP_FIREBASE_EMULATOR_AUTH!);

    firebase
      .firestore()
      .useEmulator(
        "localhost",
        parseInt(process.env.REACT_APP_FIREBASE_EMULATOR_FIRESTORE_PORT!)
      );

    firebase
      .functions()
      .useEmulator(
        "localhost",
        parseInt(process.env.REACT_APP_FIREBASE_EMULATOR_FUNCTIONS_PORT!)
      );
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
