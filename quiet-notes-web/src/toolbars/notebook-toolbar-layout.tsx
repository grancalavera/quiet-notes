import Box from "@mui/material/Box";
import { PropsWithChildren, ReactNode } from "react";
import { NotebookButtonGroup } from "./notebook-toolbar-button";

export const NotebookToolbarLayout = (
  props: PropsWithChildren<{
    title?: ReactNode;
  }>
) => (
  <Box
    className="qn-notebook-toolbar-layout"
    data-testid="notebook-toolbar-layout"
    sx={{
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 0.5,
      paddingBottom: 0,
    }}
  >
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
      }}
    >
      {props.title}
    </Box>
    <NotebookButtonGroup>{props.children}</NotebookButtonGroup>
  </Box>
);
