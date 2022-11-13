import { bind } from "@react-rxjs/core";
import { QNRole } from "quiet-notes-lib";
import { interval, map, of, startWith, switchMap } from "rxjs";
import { authService } from "../services/auth-service";

export const [useAuthState] = bind(authService.authState$);
export const [useUser] = bind(authService.user$);

export const [useHasRole] = bind((role: QNRole, poll = false) => {
  const hasRole$ = authService.roles$.pipe(map((roles) => roles.includes(role)));

  return hasRole$.pipe(
    switchMap((hasRole) =>
      poll
        ? interval(1000).pipe(
            switchMap(() => hasRole$),
            startWith(hasRole)
          )
        : of(hasRole)
    )
  );
});
