import { Functions, httpsCallable } from "firebase/functions";
import { QNListUsersResponse, QNToggleRole, QNToggleRoleResponse } from "quiet-notes-lib";
import { useCallback, useEffect, useState } from "react";
import { useUnknownErrorHandler } from "../app/app-state";
import { useFunctions } from "../firebase/firebase-initialize";

const listUsers = (fns: Functions) =>
  httpsCallable<void, QNListUsersResponse>(fns, "listUsers")();

export const useUserList = () => {
  const [data, setData] = useState<QNListUsersResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const handleUnknownError = useUnknownErrorHandler();
  const fns = useFunctions();

  const run = useCallback(() => {
    setIsLoading(true);
    async function run() {
      try {
        const result = await listUsers(fns);
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

const toggleRole = (fns: Functions, toggle: QNToggleRole) =>
  httpsCallable<QNToggleRole, QNToggleRoleResponse>(fns, "toggleRole")(toggle);

export const useToggleRole = () => {
  const [data, setData] = useState<QNToggleRoleResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const handleUnknownError = useUnknownErrorHandler();
  const fns = useFunctions();

  const run = useCallback(
    (toggle: QNToggleRole) => {
      setIsLoading(true);
      async function run() {
        try {
          const result = await toggleRole(fns, toggle);
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
