import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { authState } from "rxfire/auth";
import { docData } from "rxfire/firestore";
import { combineLatest, firstValueFrom, from } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
} from "rxjs/operators";
import { AuthServiceSchema } from "../auth/auth-service-schema";
import { isNotNullable } from "../lib/isNotNullable";
import { peek } from "../lib/peek";
import { userConverter } from "./auth-service-model";
import { auth$, firestore$ } from "./firebase";

const maybeUser$ = auth$.pipe(switchMap((auth) => authState(auth)));
const unsafeUser$ = maybeUser$.pipe(filter(isNotNullable));

const authenticated$ = maybeUser$.pipe(
  peek("authenticated$ [enter]"),
  map((user) => !!user),
  distinctUntilChanged(),
  peek("authenticated$ [exit]")
);

const user$ = combineLatest([firestore$, unsafeUser$]).pipe(
  peek("user$ [1] [enter]"),
  switchMap(([firestore, user]) => {
    // this is unsafe because before we can read
    // the user roles we need to refresh the token
    // to make sure the claims are up to date
    // when rules are evaluated.
    const unsafe_user$ = docData(
      doc(firestore, "users", user.uid).withConverter(userConverter)
    ).pipe(filter(isNotNullable));

    return unsafe_user$.pipe(
      peek("user$ [2] unsafe_user$"),
      switchMap(() =>
        from(user.getIdTokenResult(true)).pipe(
          peek("user$ [3] getIdTokenResult(true)"),
          switchMap(() => unsafe_user$),
          peek("user$ [4] user$")
        )
      )
    );
  }),
  shareReplay(1)
);

const roles$ = user$.pipe(map((user) => user.customClaims.roles));

export const authService: AuthServiceSchema = {
  signIn: async () => {
    const auth = await firstValueFrom(auth$);
    await signInWithPopup(auth, new GoogleAuthProvider());
  },
  signOut: async () => {
    const auth = await firstValueFrom(auth$);
    return signOut(auth);
  },
  authenticated$,
  user$,
  roles$,
};
