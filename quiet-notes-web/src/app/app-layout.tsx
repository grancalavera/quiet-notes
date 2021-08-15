import { ReactNode } from "react";
import { block } from "../app/bem";
import "./app-layout.scss";

interface AppLayoutProps {
  className?: string;
  header?: ReactNode;
  body?: ReactNode;
}

const b = block("app-layout");

export const AppLayout = (props: AppLayoutProps) => {
  return (
    <div className={b({}).mix(props.className)}>
      <div className={b("header")}>{props.header}</div>
      <div className={b("body")}>{props.body}</div>
    </div>
  );
};
