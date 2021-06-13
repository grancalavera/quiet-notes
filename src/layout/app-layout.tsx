import React, { ReactNode } from "react";
import { useBlock } from "../app/bem";
import "./app-layout.scss";

interface AppLayoutProps {
  header: ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const b = useBlock("app-layout");
  return (
    <div className={b({}).mix(props.className)}>
      <header className={b("header")}>{props.header}</header>
      <div className={b("body")}>{props.children}</div>
    </div>
  );
};
