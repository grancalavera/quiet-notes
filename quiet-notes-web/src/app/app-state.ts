import create, { State } from "zustand";
import { AppError, errorFromUnknown, QNError } from "./app-error";
import firebase from "firebase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QNRole } from "quiet-notes-lib";

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

const useUserRoles = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>();
  const handleError = useErrorHandler();
  const user = useUser();

  useEffect(() => {
    setIsLoading(true);

    user
      .getIdTokenResult(true)
      .then(({ claims }) => {
        const roles: string[] = claims.roles;
        setRoles(roles);
      })
      .catch((e) => handleError(e))
      .finally(() => setIsLoading(false));
  }, [handleError, user]);

  return [roles, isLoading] as const;
};

const useHasRole = (roleName: QNRole) => {
  const [roles, isLoading] = useUserRoles();

  return useMemo(
    () => [(roles ?? []).includes(roleName), isLoading] as const,

    [isLoading, roleName, roles]
  );
};

export const useIsAdmin = () => useHasRole("admin");
export const useIsAuthor = () => useHasRole("author");

const selectHandleError = (s: AppState) => s.handleError;

export const useErrorHandler = () => useAppState(selectHandleError);

export const useUnknownErrorHandler = () => {
  const handleError = useErrorHandler();
  return useCallback(
    (error: unknown) => {
      handleError(errorFromUnknown(error));
    },
    [handleError]
  );
};

export const useNotImplementedError = (featureName: string) => {
  const handleError = useErrorHandler();

  return useCallback(() => {
    handleError(new QNError(`${featureName} not implemented`));
  }, [featureName, handleError]);
};
