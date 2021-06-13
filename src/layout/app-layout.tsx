import React from "react";
import { SignIn } from "../app/auth";
import { block } from "../app/bem";
import { useAuthState } from "../firebase/firebase";
import "./app-layout.scss";
import { CenterLayout } from "./center-layout";

const b = block("app-layout");

interface AppLayoutProps {
  header: JSX.Element;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const [user] = useAuthState();
  return (
    <div className={b({}).mix(props.className)}>
      <header className={b("header")}>{props.header}</header>
      <div className={b("body")}>
        {user ? (
          props.children
        ) : (
          <CenterLayout>
            <SignIn />
          </CenterLayout>
        )}
      </div>
    </div>
  );
};
