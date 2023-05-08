import { bind } from "@react-rxjs/core";
import { QNRole } from "quiet-notes-lib";
import { map } from "rxjs";
import { authService } from "../services/auth-service";

export const [useAuthState] = bind(authService.authenticated$);
export const [useUser] = bind(authService.user$);
export const [useHasRole, hasRole$] = bind((role: QNRole) =>
  authService.roles$.pipe(map((roles) => roles.includes(role)))
);
export const [useIsAdmin] = bind(hasRole$("admin"));
export const [useIsAuthor] = bind(hasRole$("author"));
