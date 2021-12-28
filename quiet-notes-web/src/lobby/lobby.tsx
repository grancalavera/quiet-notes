import Typography from "@mui/material/Typography";
import { Redirect } from "react-router-dom";
import { useIsAdmin, useIsAuthor } from "../auth/user-streams";
import { CenterLayout } from "../layout/center-layout";

export const Lobby = () => {
  const isAdmin = useIsAdmin();
  const isAuthor = useIsAuthor();

  return (
    <>
      {isAuthor && <Redirect to="/notebook" />}
      {isAdmin && <Redirect to="/admin" />}
      <CenterLayout>
        <div>
          <Typography variant="h6">Your application is being reviewed!</Typography>
          <Typography variant="body1">
            Come back soon to check if it has been approved.
          </Typography>
        </div>
      </CenterLayout>
    </>
  );
};
