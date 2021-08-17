import { Button } from "@blueprintjs/core";
import { useUserList } from "../app/app-service";

export const Admin = () => {
  const { data: userList, refetch, isLoading } = useUserList();

  return (
    <>
      <Button
        loading={isLoading}
        onClick={refetch}
        icon="refresh"
        minimal
        style={{ position: "sticky" }}
      />
      <pre>{JSON.stringify(userList, null, 2)}</pre>
    </>
  );
};
