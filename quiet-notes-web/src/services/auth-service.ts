import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { QNRole } from "quiet-notes-lib";
import { authState } from "rxfire/auth";
import { filter, map, switchMap } from "rxjs/operators";
import { AuthServiceSchema } from "./auth-service-schema";
import { auth$ } from "./firebase";

const authState$ = auth$.pipe(switchMap((auth) => authState(auth)));

const user$ = authState$.pipe(filter(Boolean));

export const authService: AuthServiceSchema = {
  signIn: () =>
    auth$.pipe(switchMap((auth) => signInWithPopup(auth, new GoogleAuthProvider()))),

  signOut: () => auth$.pipe(switchMap((auth) => signOut(auth))),

  authState$,

  user$,

  roles$: user$.pipe(
    switchMap((user) => user.getIdTokenResult(true)),
    map(({ claims }) => claims.roles as QNRole[])
  ),
};
