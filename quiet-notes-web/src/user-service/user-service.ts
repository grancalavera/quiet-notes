import firebase from "firebase/compat/app";
import { QNListUsersResponse, QNToggleRole, QNToggleRoleResponse } from "quiet-notes-lib";
import { useCallback, useEffect, useState } from "react";
import { useUnknownErrorHandler } from "../app/app-state";

const listUsers = () => firebase.functions().httpsCallable("listUsers")();

export const useUserList = () => {
  const [data, setData] = useState<QNListUsersResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const handleUnknownError = useUnknownErrorHandler();

  const run = useCallback(() => {
    setIsLoading(true);
    async function run() {
      try {
        const result = await listUsers();
        setData(result.data);
      } catch (error) {
        handleUnknownError(error);
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, [handleUnknownError]);

  useEffect(() => {
    run();
  }, [handleUnknownError, run]);

  return { data, isLoading, refetch: run };
};

const toggleRole = (toggle: QNToggleRole) =>
  firebase.functions().httpsCallable("toggleRole")(toggle);

export const useToggleRole = () => {
  const [data, setData] = useState<QNToggleRoleResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const handleUnknownError = useUnknownErrorHandler();

  const run = useCallback(
    (toggle: QNToggleRole) => {
      setIsLoading(true);
      async function run() {
        try {
          const result = await toggleRole(toggle);
          setData(result.data);
        } catch (error) {
          handleUnknownError(error);
        } finally {
          setIsLoading(false);
        }
      }
      run();
    },
    [handleUnknownError]
  );

  return { data, isLoading, mutate: run };
};
