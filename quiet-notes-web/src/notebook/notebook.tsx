import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

interface NotebookProps {
  className?: string;
  sidebarToolbar?: ReactNode;
  sidebar?: ReactNode;
  editorToolbar?: ReactNode;
  editor?: ReactNode;
  editorSidebar?: ReactNode;
}

export const Notebook = (props: NotebookProps) => (
  <Layout showSidebar={!!props.editorSidebar}>
    <Box
      sx={{
        borderRightWidth: 1,
        borderRightStyle: "solid",
        borderRightColor: "divider",
        gridArea: "sidebar-toolbar",
        overflow: "hidden",
      }}
    >
      {props.sidebarToolbar}
    </Box>
    <Box
      sx={{
        borderRightWidth: 1,
        borderRightStyle: "solid",
        borderRightColor: "divider",
        gridArea: "sidebar",
        overflow: "hidden",
      }}
    >
      {props.sidebar}
    </Box>
    <Box
      sx={{
        gridArea: "editor-toolbar",
        overflow: "hidden",
      }}
    >
      {props.editorToolbar}
    </Box>
    <Box
      sx={{
        gridArea: "editor",
        overflow: "hidden",
      }}
    >
      {props.editor}
    </Box>
    {props.editorSidebar ? (
      <Box
        sx={{
          gridArea: "editor-sidebar",
          overflow: "hidden",
        }}
      >
        {props.editorSidebar}
      </Box>
    ) : null}
  </Layout>
);

const Layout = styled("div")<{ showSidebar: boolean }>`
  display: grid;
  height: 100%;
  grid-template-columns: 300px 1fr 1fr;
  grid-template-rows: auto 1fr;

  grid-template-areas:
    "sidebar-toolbar editor-toolbar editor-toolbar"
    "sidebar editor ${({ showSidebar }) =>
      showSidebar ? "editor-sidebar" : "editor"}";
`;
