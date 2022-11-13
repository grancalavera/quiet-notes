import { Functions, httpsCallable } from "firebase/functions";
import { QNListUsersResponse, QNToggleRole, QNToggleRoleResponse } from "quiet-notes-lib";
import { useCallback, useEffect, useState } from "react";
import { handleUnknownError } from "../app/app-error-state";
import { useFunctions } from "./firebase";

const listUsers = (fns: Functions) => httpsCallable<void, QNListUsersResponse>(fns, "listUsers")();

export const useUserList = () => {
  const [data, setData] = useState<QNListUsersResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const fns = useFunctions();

  const doFetch = useCallback(() => {
    setIsLoading(true);
    (async function () {
      try {
        const result = await listUsers(fns);
        setData(result.data);
      } catch (error) {
        handleUnknownError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, isLoading, refetch: doFetch };
};

const toggleRole = (fns: Functions, toggle: QNToggleRole) =>
  httpsCallable<QNToggleRole, QNToggleRoleResponse>(fns, "toggleRole")(toggle);

export const useToggleRole = () => {
  const [data, setData] = useState<QNToggleRoleResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const fns = useFunctions();

  const run = useCallback((toggle: QNToggleRole) => {
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
  }, []);

  return { data, isLoading, mutate: run };
};
