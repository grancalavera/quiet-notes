import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as firebaseHooks from "react-firebase-hooks/auth";

// https://stackoverflow.com/questions/43331011/firebase-app-named-default-already-exists-app-duplicate-app
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyB-1sXAYdvXVOQgHUcZwP9CpI6dNq1wi7Y",
    authDomain: "quiet-notes-e83fb.firebaseapp.com",
    projectId: "quiet-notes-e83fb",
    storageBucket: "quiet-notes-e83fb.appspot.com",
    messagingSenderId: "730652202246",
    appId: "1:730652202246:web:a4b7f52a8b4ae087e9ba87",
  });
} else {
  // if already initialized, use that one
  firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

if (
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_FIREBASE_USE_EMULATORS === "true"
) {
  auth.useEmulator(process.env.REACT_APP_FIREBASE_EMULATOR_AUTH!);
  firestore.useEmulator(
    "localhost",
    parseInt(process.env.REACT_APP_FIREBASE_EMULATOR_FIRESTORE_PORT!)
  );
}

export const signIn = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
export const signOut = () => auth.signOut();
export const useAuthState = () => firebaseHooks.useAuthState(auth);

export const useUserInfo = (): firebase.UserInfo | undefined => {
  const [user] = useAuthState();

  return user
    ? {
        uid: user.uid,
        providerId: user.providerId,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        email: user.email,
        displayName: user.displayName,
      }
    : undefined;
};
