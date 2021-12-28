import { bind } from "@react-rxjs/core";
import { getAuth } from "firebase/auth";
import { QNRole } from "quiet-notes-lib";
import { useMemo } from "react";
import { authState } from "rxfire/auth";
import { filter, map, switchMap } from "rxjs/operators";
import { firebaseApp$ } from "../firebase/firebase-initialize";

export const authState$ = firebaseApp$.pipe(switchMap((app) => authState(getAuth(app))));
export const user$ = authState$.pipe(filter(Boolean));

export const userRoles$ = user$.pipe(
  switchMap((user) => user.getIdTokenResult(true)),
  map(({ claims }) => claims.roles as string[])
);

export const [useAuthState] = bind(authState$);
export const [useUser] = bind(user$);
export const [useUserRoles] = bind(userRoles$);

export const useHasRole = (roleName: QNRole): boolean => {
  const roles = useUserRoles();
  return useMemo(() => roles.includes(roleName), [roleName, roles]);
};

export const useIsAdmin = () => useHasRole("admin");
export const useIsAuthor = () => useHasRole("author");
