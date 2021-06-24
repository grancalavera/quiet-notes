import { Button } from "@blueprintjs/core";
import React from "react";
import { signIn, useAuthState } from "../firebase/firebase";
import { CenterLayout } from "../layout/center-layout";
import { Notebook } from "../notebook/notebook-container";

export const App = () => {
  const [user] = useAuthState();
  return user ? (
    <Notebook />
  ) : (
    <CenterLayout>
      <Button large onClick={signIn}>
        Sign In with Google
      </Button>
    </CenterLayout>
  );
};
