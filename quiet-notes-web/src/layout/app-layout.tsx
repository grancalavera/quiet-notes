import { ReactNode } from "react";
import { block } from "../app/bem";
import "./app-layout.scss";

interface AppLayoutProps {
  className?: string;

  header?: ReactNode;

  sidebarToolbar?: ReactNode;
  sidebar?: ReactNode;

  editorToolbar?: ReactNode;
  editor?: ReactNode;
}

const b = block("app-layout");

export const AppLayout = (props: AppLayoutProps) => {
  return (
    <div className={b({}).mix(props.className)}>
      <div className={b("header")}>{props.header}</div>

      <div className={b("sidebar-toolbar")}>{props.sidebarToolbar}</div>
      <div className={b("sidebar")}>{props.sidebar}</div>

      <div className={b("editor-toolbar")}>{props.editorToolbar}</div>
      <div className={b("editor")}>{props.editor}</div>
    </div>
  );
};
