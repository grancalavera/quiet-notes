import { bind } from "@react-rxjs/core";
import { QNRole } from "quiet-notes-lib";
import { map, switchMap } from "rxjs";
import { authService } from "../services/auth-service";

export const [useAuthState] = bind(authService.authState$);
export const [useUser] = bind(authService.user$);

export const [useHasRole, hasRole$] = bind((role: QNRole) => {
  const hasRole$ = authService.roles$.pipe(map((roles) => roles.includes(role)));
  return authService.rolesUpdated$.pipe(switchMap(() => hasRole$));
});

export const [useIsAdmin] = bind(hasRole$("admin"));
export const [useIsAuthor] = bind(hasRole$("author"));
