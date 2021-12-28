import Button from "@mui/material/Button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { QNRole } from "quiet-notes-lib";
import { PropsWithChildren, ReactNode, useEffect } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { useAuthState, useHasRole } from "../auth/user-streams";
import { useAuth } from "../firebase/firebase-initialize";
import { CenterLayout } from "../layout/center-layout";

type CustomRouteProps<T extends {} = {}> = PropsWithChildren<T> &
  RouteProps<string> &
  Omit<PropsWithChildren<T>, keyof Route>;

export const PrivateRoute = ({ children, ...rest }: CustomRouteProps) => (
  <Route {...rest}>
    <AuthState
      authenticated={children}
      notAuthenticated={
        <Redirect
          to={{
            pathname: "/login",
            state: { from: useLocation() },
          }}
        />
      }
    />
  </Route>
);

const createRoleRoute =
  (role: QNRole, redirectTo: string) =>
  ({ children, ...rest }: CustomRouteProps) =>
    (
      <Route {...rest}>
        {useHasRole(role) ? <>{children}</> : <Redirect to={redirectTo} />}
      </Route>
    );

export const AdminRoute = createRoleRoute("admin", "/");
export const AuthorRoute = createRoleRoute("author", "/lobby");

interface LocationState {
  from?: { pathname?: string };
}

export const LoginPage = () => {
  const auth = useAuth();

  return (
    <AuthState
      authenticated={
        <Redirect
          to={useLocation<LocationState | undefined>().state?.from?.pathname ?? "/"}
        />
      }
      notAuthenticated={
        <CenterLayout>
          <Button
            variant="contained"
            onClick={() => {
              signInWithPopup(auth, new GoogleAuthProvider());
            }}
          >
            Sign In with Google
          </Button>
        </CenterLayout>
      }
    />
  );
};

interface AuthStateProps {
  authenticated: ReactNode;
  notAuthenticated: ReactNode;
}

const AuthState = ({ authenticated, notAuthenticated }: AuthStateProps) =>
  useAuthState() ? <>{authenticated}</> : <>{notAuthenticated}</>;
