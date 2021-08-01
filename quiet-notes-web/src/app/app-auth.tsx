import { Button, Spinner } from "@blueprintjs/core";
import firebase from "firebase/app";
import { PropsWithChildren, ReactNode } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { CenterLayout } from "../layout/center-layout";
import { assertNever } from "../utils/assert-never";
import { useResolveAuthState } from "./app-resolve-auth-state";

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
  const authState = useResolveAuthState();

  switch (authState.kind) {
    case "Authenticated":
      return <>{authenticated}</>;
    case "Authenticating":
      return (
        <CenterLayout>
          <Spinner />
        </CenterLayout>
      );
    case "NotAuthenticated":
      return <>{notAuthenticated}</>;
    default:
      assertNever(authState);
  }
};
