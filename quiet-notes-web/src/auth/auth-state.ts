import { bind } from "@react-rxjs/core";
import { QNRole } from "quiet-notes-lib";
import { useMemo } from "react";
import { authService } from "../services/auth-service";

export const [useAuthState] = bind(authService.authState$);
export const [useUser] = bind(authService.user$);
const [useUserRoles] = bind(authService.roles$);

export const useHasRole = (roleName: QNRole): boolean => {
  const roles = useUserRoles();
  return useMemo(() => roles.includes(roleName), [roleName, roles]);
};

export const useIsAdmin = () => useHasRole("admin");
export const useIsAuthor = () => useHasRole("author");
