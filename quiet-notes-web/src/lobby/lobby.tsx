import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import { useIsAdmin, useIsAuthor } from "../auth/auth-state";
import { CenterLayout } from "../layout/center-layout";

export const Lobby = () => {
  const isAdmin = useIsAdmin();
  const isAuthor = useIsAuthor();

  if (isAuthor) {
    return <Navigate to="/notebook" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <CenterLayout>
      <div>
        <Typography variant="h6">Your application is being reviewed!</Typography>
        <Typography variant="body1">Come back soon to check if it has been approved.</Typography>
      </div>
    </CenterLayout>
  );
};
