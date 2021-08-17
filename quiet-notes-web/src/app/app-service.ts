import firebase from "firebase";
import { useCallback, useEffect, useState } from "react";
import { QNError } from "./app-error";
import { useErrorHandler } from "./app-state";

type QNRole = "admin" | "author" | "user";

interface ListUsersResponse {
  users: QNUserRecord[];
}

interface QNUserRecord {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  roles: QNRole[];
}

const listUsers = () => firebase.functions().httpsCallable("listUsers")();

export const useUserList = () => {
  const [anchor, setAnchor] = useState(Date.now());
  const [data, setData] = useState<ListUsersResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandler();

  useEffect(() => {
    setIsLoading(true);
    async function runListUsers() {
      try {
        const result = await listUsers();
        setData(result.data);
      } catch (error) {
        handleError(new QNError(error.message ?? "Unknown error", error));
      } finally {
        setIsLoading(false);
      }
    }
    runListUsers();
  }, [handleError, anchor]);

  const refetch = useCallback(() => {
    setAnchor(Date.now());
  }, []);

  return { data, isLoading, refetch };
};
