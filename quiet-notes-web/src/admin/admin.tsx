import { useEffect } from "react";
import { useUserList } from "../app/app-service";

export const Admin = () => {
  const [userList] = useUserList();

  useEffect(() => {
    console.log({ userList });
  }, [userList]);

  return <pre style={{ padding: 10 }}>{JSON.stringify(userList, null, 2)}</pre>;
};
