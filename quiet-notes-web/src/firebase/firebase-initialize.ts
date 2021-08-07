import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useEffect, useState } from "react";

const initializeFirebase = async (onInitialized: () => void) => {
  const response = await fetch("/__/firebase/init.json");
  const config = await response.json();
  firebase.initializeApp(config);

  if (
    process.env.NODE_ENV === "development" &&
    process.env.REACT_APP_FIREBASE_USE_EMULATORS === "true"
  ) {
    firebase.auth().useEmulator(process.env.REACT_APP_FIREBASE_EMULATOR_AUTH!);
    firebase
      .firestore()
      .useEmulator(
        "localhost",
        parseInt(process.env.REACT_APP_FIREBASE_EMULATOR_FIRESTORE_PORT!)
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
