import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as fbhAuth from "react-firebase-hooks/auth";

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
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
// const firestore = firebase.firestore();

export const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

export const signOut = () => auth.signOut();

export const useAuthState = () => fbhAuth.useAuthState(auth);
