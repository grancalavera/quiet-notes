import firebase from "firebase/app";
import * as firebaseHooks from "react-firebase-hooks/auth";

/** @deprecated  */
export const signIn = () => {
  const auth = firebase.auth();
  return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

/** @deprecated  */
export const signOut = () => {
  const auth = firebase.auth();
  return auth.signOut();
};

export const useAuthState = () => {
  const auth = firebase.auth();
  return firebaseHooks.useAuthState(auth);
};

/** @deprecated  */
export const useUserInfo = (): firebase.UserInfo => {
  const [user] = useAuthState();

  if (!user) {
    throw new Error("not authenticated");
  } else {
    return {
      uid: user.uid,
      providerId: user.providerId,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      email: user.email,
      displayName: user.displayName,
    };
  }
};
