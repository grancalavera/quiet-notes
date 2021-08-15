import create, { State } from "zustand";
import { AppError, QNError } from "./app-error";
import firebase from "firebase";
import { useCallback, useEffect, useMemo, useState } from "react";

type User = firebase.User;

interface AppState extends State {
  errors: AppError[];
  handleError: (error: AppError) => void;
  dismissError: () => void;

  getUser: () => User;
  setUser: (user: User) => void;
  reset: () => void;
}

const throwUserNotSet = (): User => {
  throw new Error("User not set");
};

export const useAppState = create<AppState>((set) => ({
  getUser: throwUserNotSet,
  setUser: (user: User) => set({ getUser: () => user }),
  reset: () => set({ getUser: throwUserNotSet }),

  errors: [],
  handleError: (error) => set(({ errors }) => ({ errors: [...errors, error] })),
  dismissError: () => set(({ errors }) => ({ errors: errors.slice(1) })),
}));

const selectUser = (s: AppState) => s.getUser();
export const useUser = () => useAppState(selectUser);

export const useUserRoles = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>();
  const handleError = useErrorHandler();
  const user = useUser();

  useEffect(() => {
    setIsLoading(true);

    user
      .getIdTokenResult()
      .then(({ claims }) => {
        const roles: string[] = claims.roles;
        setRoles(roles);
      })
      .catch((e) => handleError(e))
      .finally(() => setIsLoading(false));
  }, [handleError, user]);

  return [roles, isLoading] as const;
};

export const useIsAdmin = () => {
  const [roles, isLoading] = useUserRoles();

  return useMemo(
    () => [(roles ?? []).includes("admin"), isLoading] as const,

    [isLoading, roles]
  );
};

const selectHandleError = (s: AppState) => s.handleError;
export const useErrorHandler = () => useAppState(selectHandleError);

export const useNotImplementedError = (featureName: string) => {
  const handleError = useErrorHandler();

  return useCallback(() => {
    handleError(new QNError(`${featureName} not implemented`));
  }, [featureName, handleError]);
};
