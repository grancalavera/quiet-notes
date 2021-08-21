import { ReactNode } from "react";
import { block } from "../app/bem";
import "./notebook-layout.scss";

interface NotebookLayoutProps {
  className?: string;
  sidebarToolbar?: ReactNode;
  sidebar?: ReactNode;
  editorToolbar?: ReactNode;
  editor?: ReactNode;
}

const b = block("notebook-layout");

export const NotebookLayout = (props: NotebookLayoutProps) => {
  return (
    <div className={b({}).mix(props.className)}>
      <div className={b("sidebar-toolbar")}>{props.sidebarToolbar}</div>
      <div className={b("sidebar")}>{props.sidebar}</div>

      <div className={b("editor-toolbar")}>{props.editorToolbar}</div>
      <div className={b("editor")}>{props.editor}</div>
    </div>
  );
};
