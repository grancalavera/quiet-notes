import { H4 } from "@blueprintjs/core";
import { Redirect } from "react-router-dom";
import { useHasRole } from "../app/app-state";
import { CenterLayout } from "../layout/center-layout";

export const Lobby = () => {
  const [isAdmin] = useHasRole("admin");
  const [isAuthor] = useHasRole("author");

  return (
    <>
      {isAuthor && <Redirect to="/notebook" />}
      {isAdmin && <Redirect to="/admin" />}
      <CenterLayout>
        <div>
          <H4>Your application is being reviewed!</H4>
          <p>Come back soon to check if it has been approved.</p>
        </div>
      </CenterLayout>
    </>
  );
};
