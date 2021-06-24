import React, { ReactNode } from "react";
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
const cell = b("cell").toString();
const left = b("left").toString();
const right = b("right").toString();

export const AppLayout = (props: AppLayoutProps) => {
  return (
    <div className={b({}).mix(props.className)}>
      <div className={b("header").mix(cell)}>{props.header}</div>

      <div className={b("sidebar-toolbar").mix(cell, left)}>{props.sidebarToolbar}</div>
      <div className={b("sidebar").mix(cell, left)}>{props.sidebar}</div>

      <div className={b("editor-toolbar").mix(cell, right)}>{props.editorToolbar}</div>
      <div className={b("editor").mix(cell, right)}>{props.editor}</div>
    </div>
  );
};
