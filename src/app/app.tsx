import { Button } from "@blueprintjs/core";
import React from "react";
import { signIn, useAuthState } from "../firebase/firebase";
import { CenterLayout } from "../layout/center-layout";

export const App = () => {
  const [user] = useAuthState();
  return user ? (
    <CenterLayout>OK Computer</CenterLayout>
  ) : (
    <CenterLayout>
      <Button large onClick={signIn} icon="user">
        Sign In with Google
      </Button>
    </CenterLayout>
  );
};
