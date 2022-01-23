import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { QNRole } from "quiet-notes-lib";
import { authState } from "rxfire/auth";
import { firstValueFrom } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { AuthServiceSchema } from "./auth-service-schema";
import { auth$ } from "./firebase";

const authState$ = auth$.pipe(switchMap((auth) => authState(auth)));
const user$ = authState$.pipe(filter(Boolean));

export const authService: AuthServiceSchema = {
  signIn: () => {
    const source$ = auth$.pipe(
      switchMap((auth) => signInWithPopup(auth, new GoogleAuthProvider()))
    );
    return firstValueFrom(source$);
  },

  signOut: () => {
    const source$ = auth$.pipe(switchMap(signOut));
    return firstValueFrom(source$);
  },

  authState$,

  user$,

  roles$: user$.pipe(
    switchMap((user) => user.getIdTokenResult(true)),
    map(({ claims }) => parseRoles(claims.roles))
  ),
};

const parseRoles = (maybeRoles: string | object | undefined) =>
  Array.isArray(maybeRoles) ? (maybeRoles as QNRole[]) : [];
