import firebase from "firebase";
import { useCallback, useEffect, useState } from "react";
import { QNError } from "../app/app-error";
import { useErrorHandler } from "../app/app-state";
import {
  QNListUsersResponse,
  QNToggleRole,
  QNToggleRoleResponse,
} from "./user-service-model";

const listUsers = () => firebase.functions().httpsCallable("listUsers")();

export const useUserList = () => {
  const [data, setData] = useState<QNListUsersResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandler();

  const run = useCallback(() => {
    setIsLoading(true);
    async function run() {
      try {
        const result = await listUsers();
        setData(result.data);
      } catch (error) {
        handleError(new QNError(error.message ?? "Unknown error", error));
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, [handleError]);

  useEffect(() => {
    run();
  }, [handleError, run]);

  return { data, isLoading, refetch: run };
};

const toggleRole = (toggle: QNToggleRole) =>
  firebase.functions().httpsCallable("toggleRole")(toggle);

export const useToggleRole = () => {
  const [data, setData] = useState<QNToggleRoleResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandler();

  const run = useCallback(
    (toggle: QNToggleRole) => {
      setIsLoading(true);
      async function run() {
        try {
          const result = await toggleRole(toggle);
          setData(result.data);
        } catch (error) {
          handleError(new QNError(error.message ?? "Unknown error", error));
        } finally {
          setIsLoading(false);
        }
      }
      run();
    },
    [handleError]
  );

  return { data, isLoading, mutate: run };
};
