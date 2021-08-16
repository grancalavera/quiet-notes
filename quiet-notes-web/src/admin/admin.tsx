import { useUserList } from "../app/app-service";
import { useIsAdmin } from "../app/app-state";

export const Admin = () => {
  const isAdmin = useIsAdmin();
  useUserList();
  return <>Admin Panel: {isAdmin ? "is admin" : "is not admin"}</>;
};
