import { bind } from "@react-rxjs/core";
import { QNRole } from "quiet-notes-lib";
import { catchError, map, NEVER, switchMap } from "rxjs";
import { peek } from "../lib/peek";
import { authService } from "../services/auth-service";

export const [useAuthState] = bind(authService.authState$);
export const [useUser] = bind(authService.user$);

export const [useHasRole, hasRole$] = bind((role: QNRole) => {
  const hasRole$ = authService.roles$.pipe(map((roles) => roles.includes(role)));
  return authService.rolesUpdated$.pipe(
    peek("rolesUpdated$"),
    switchMap(() => hasRole$)
  );
});

export const [useAnyRoleUpdated] = bind(authService.anyRoleUpdated$.pipe(catchError(() => NEVER)));
export const [useIsAdmin] = bind(hasRole$("admin"));
export const [useIsAuthor] = bind(hasRole$("author"));
