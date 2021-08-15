import { useIsAdmin } from "../app/app-state";

export const Admin = () => {
  const isAdmin = useIsAdmin();
  return <>Admin Panel: {isAdmin ? "is admin" : "is not admin"}</>;
};
