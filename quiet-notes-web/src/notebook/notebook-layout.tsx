import Box from "@mui/material/Box";
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
      <Box
        sx={{
          borderRightWidth: 1,
          borderRightStyle: "solid",
          borderRightColor: "divider",
        }}
        className={b("sidebar-toolbar").toString()}
      >
        {props.sidebarToolbar}
      </Box>
      <Box
        sx={{
          borderRightWidth: 1,
          borderRightStyle: "solid",
          borderRightColor: "divider",
        }}
        className={b("sidebar").toString()}
      >
        {props.sidebar}
      </Box>
      <Box className={b("editor-toolbar")}>{props.editorToolbar}</Box>
      <Box className={b("editor")}>{props.editor}</Box>
    </div>
  );
};
