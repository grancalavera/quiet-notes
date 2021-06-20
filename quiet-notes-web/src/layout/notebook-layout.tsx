import { ReactNode } from "react";
import { useBlock } from "../app/bem";
import "./notebook-layout.scss";

interface NotebookLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export const NotebookLayout = (props: NotebookLayoutProps) => {
  const b = useBlock("notebook-layout");
  return (
    <div className={b()}>
      <aside className={b("sidebar")}>{props.sidebar}</aside>
      <section className={b("content")}>{props.content}</section>
    </div>
  );
};
