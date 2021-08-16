import firebase from "firebase";
import { useEffect, useState } from "react";
import { QNError } from "./app-error";
import { useErrorHandler } from "./app-state";

const listUsers = () => firebase.functions().httpsCallable("listUsers")();

export const useUserList = () => {
  const [data, setData] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandler();

  useEffect(() => {
    setIsLoading(true);
    async function runListUsers() {
      try {
        await listUsers();
        setData("ok");
      } catch (error) {
        handleError(new QNError(error.message ?? "Unknown error", error));
      } finally {
        setIsLoading(false);
      }
    }
    runListUsers();
  }, [handleError]);

  return [data, isLoading] as const;
};
