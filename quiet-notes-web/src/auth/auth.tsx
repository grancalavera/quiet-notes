import Button from "@mui/material/Button";
import { QNRole } from "quiet-notes-lib";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CenterLayout } from "../layout/center-layout";
import { authService } from "../services/auth-service";
import { useAuthState, useHasRole } from "./auth-state";

interface RoleProps {
  role: QNRole;
  fallback: string;
}

export const RequireRole = ({ children, role, fallback }: PropsWithChildren<RoleProps>) =>
  useHasRole(role) ? <>{children}</> : <Navigate to={fallback} />;

export const RequireAuth = ({ children }: PropsWithChildren<{}>) =>
  useAuthState() ? <>{children}</> : <Navigate to="/login" state={{ from: useLocation() }} />;

export const LoginPage = () =>
  useAuthState() ? (
    <Navigate to={useLocation().state?.from?.pathname ?? "/"} />
  ) : (
    <CenterLayout>
      <Button variant="contained" onClick={() => authService.signIn()}>
        Sign In with Google
      </Button>
    </CenterLayout>
  );
