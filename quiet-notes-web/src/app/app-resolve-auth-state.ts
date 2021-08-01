import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { useAuthState } from "../firebase/firebase";

type AuthState = Authenticating | NotAuthenticated | Authenticated;

interface Authenticated {
  kind: "Authenticated";
  user: firebase.User;
}

interface NotAuthenticated {
  kind: "NotAuthenticated";
}

interface Authenticating {
  kind: "Authenticating";
}

export const isAuthenticated = (state: AuthState): state is Authenticated =>
  state.kind === "Authenticated";

export const useResolveAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({ kind: "Authenticating" });
  const [user, isLoading] = useAuthState();

  useEffect(() => {
    setAuthState(() => {
      if (user && !isLoading) {
        return { kind: "Authenticated", user };
      } else if (isLoading) {
        return { kind: "Authenticating" };
      } else {
        return { kind: "NotAuthenticated" };
      }
    });
  }, [user, isLoading]);

  return authState;
};
