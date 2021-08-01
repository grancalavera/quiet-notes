import { Button, Spinner } from "@blueprintjs/core";
import firebase from "firebase/app";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { CenterLayout } from "../layout/center-layout";
import { useResolveAuthState } from "./app-resolve-auth-state";
import { useAppState } from "./app-state";

interface LocationState {
  from?: { pathname?: string };
}

type PrivateRouteProps = PropsWithChildren<{}>;

export const PrivateRoute = ({
  children,
  ...rest
}: PrivateRouteProps &
  RouteProps<string> &
  Omit<PrivateRouteProps, keyof RouteProps>) => {
  const location = useLocation();

  return (
    <Route {...rest}>
      <AuthState
        authenticated={children}
        notAuthenticated={
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        }
      />
    </Route>
  );
};

export const LoginPage = () => {
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
            large
            onClick={() => {
              firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
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

const AuthState = ({ authenticated, notAuthenticated }: AuthStateProps) => {
  const authState = useResolveAuthState();
  const setUser = useAppState((s) => s.setUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authState.kind === "Authenticated") {
      setUser(authState.user);
      setReady(true);
    }
  }, [authState, setUser]);

  return (
    <>
      {ready && authenticated}
      {authState.kind === "NotAuthenticated" && notAuthenticated}
      {authState.kind === "Authenticating" && (
        <CenterLayout>
          <Spinner />
        </CenterLayout>
      )}
    </>
  );
};
