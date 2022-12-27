import { bind } from "@react-rxjs/core";
import { QNRole } from "quiet-notes-lib";
import {
  catchError,
  map,
  MonoTypeOperatorFunction,
  NEVER,
  Observable,
  ObservableInput,
  ObservedValueOf,
  OperatorFunction,
  switchMap,
  throwError,
} from "rxjs";
import { QNError } from "../app/app-error";
import { peek } from "../lib/peek";
import { authService } from "../services/auth-service";

export const [useAuthState] = bind(authService.authState$);
export const [useUser] = bind(authService.user$);

const tagError =
  <T>(tag: string): MonoTypeOperatorFunction<T> =>
  (source$: Observable<T>) =>
    source$.pipe(
      catchError((error) => throwError(() => new QNError(tag, error)))
    );

export const [useHasRole, hasRole$] = bind((role: QNRole) => {
  const has$ = authService.roles$.pipe(map((roles) => roles.includes(role)));
  return authService.rolesUpdated$.pipe(
    peek("rolesUpdated$"),
    switchMap(() => has$),
    tagError(`${__filename}.useHasRole(${role})`)
  );
});

export const [useAnyRoleUpdated] = bind(
  authService.anyRoleUpdated$.pipe(catchError(() => NEVER))
);
export const [useIsAdmin] = bind(hasRole$("admin"));
export const [useIsAuthor] = bind(hasRole$("author"));
