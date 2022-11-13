import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { QNRole } from "quiet-notes-lib";
import { authState } from "rxfire/auth";
import { docData } from "rxfire/firestore";
import { combineLatest, firstValueFrom, NEVER } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { AuthServiceSchema } from "./auth-service-schema";
import { auth$, firestore$ } from "./firebase";

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

  rolesUpdated$: combineLatest([firestore$, authState$]).pipe(
    switchMap(([firestore, maybeUser]) => {
      if (!maybeUser) {
        return NEVER;
      }

      const docRef = doc(firestore, "roles-updates", maybeUser.uid).withConverter(
        timestampConverter
      );

      return docData(docRef);
    })
  ),
};

const parseRoles = (maybeRoles: string | object | undefined) =>
  Array.isArray(maybeRoles) ? (maybeRoles as QNRole[]) : [];

export const timestampConverter = {
  toFirestore: (): DocumentData => ({}),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<{
      timestamp: Timestamp;
    }>,
    options?: SnapshotOptions
  ): Date => {
    const data = snapshot.data(options);
    return data.timestamp.toDate();
  },
};
