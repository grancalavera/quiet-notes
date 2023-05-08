import Button from "@mui/material/Button";
import { QNRole } from "quiet-notes-lib";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CenterLayout } from "../layout/center-layout";
import { authService } from "../firebase/auth-service";
import { useAuthState, useHasRole } from "./auth-state";

interface RoleProps {
  role: QNRole;
  fallback: string;
}

export const RequireRole = ({
  children,
  role,
  fallback,
}: PropsWithChildren<RoleProps>) => {
  const hasRole = useHasRole(role);
  return hasRole ? <>{children}</> : <Navigate to={fallback} />;
};

export const RequireAuth = ({ children }: PropsWithChildren<{}>) => {
  const authState = useAuthState();
  const location = useLocation();

  return authState ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export const LoginPage = () => {
  const authState = useAuthState();
  const location = useLocation();

  return authState ? (
    <Navigate to={location.state?.from?.pathname ?? "/"} />
  ) : (
    <CenterLayout>
      <Button variant="contained" onClick={() => authService.signIn()}>
        Sign In with Google
      </Button>
    </CenterLayout>
  );
};
