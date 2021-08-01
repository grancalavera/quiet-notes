import { Button, Spinner } from "@blueprintjs/core";
import firebase from "firebase/app";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import * as firebaseHooks from "react-firebase-hooks/auth";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { CenterLayout } from "../layout/center-layout";
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
  Omit<PrivateRouteProps, keyof RouteProps>) => (
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

export const LoginPage = () => (
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

interface AuthStateProps {
  authenticated: ReactNode;
  notAuthenticated: ReactNode;
}

const AuthState = ({ authenticated, notAuthenticated }: AuthStateProps) => {
  const setUser = useAppState((s) => s.setUser);
  const reset = useAppState((s) => s.reset);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, isLoading] = firebaseHooks.useAuthState(firebase.auth());

  useEffect(() => {
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    }
  }, [setUser, user]);

  useEffect(() => {
    if (!isLoading && !user) {
      reset();
      setIsAuthenticated(false);
    }
  }, [isLoading, reset, user]);

  return (
    <>
      {isAuthenticated && authenticated}
      {!isLoading && !user && notAuthenticated}
      {isLoading && (
        <CenterLayout>
          <Spinner />
        </CenterLayout>
      )}
    </>
  );
};
