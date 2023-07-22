import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import { PropsWithChildren, ReactNode } from "react";

export const NotebookToolbarLayout = (
  props: PropsWithChildren<{
    title?: ReactNode;
  }>
) => (
  <Box
    className="qn-notebook-toolbar-layout"
    sx={{
      height: "100%",
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
    <ButtonGroup
      sx={{
        flexShrink: 0,
        flexBasis: "auto",
      }}
    >
      {props.children}
    </ButtonGroup>
  </Box>
);
