import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

interface NotebookLayoutProps {
  className?: string;
  sidebarToolbar?: ReactNode;
  sidebar?: ReactNode;
  editorToolbar?: ReactNode;
  editor?: ReactNode;
}

export const NotebookLayout = (props: NotebookLayoutProps) => {
  return (
    <Layout>
      <Box
        sx={{
          borderRightWidth: 1,
          borderRightStyle: "solid",
          borderRightColor: "divider",
          gridArea: "sidebar-toolbar",
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
        }}
      >
        {props.sidebar}
      </Box>
      <Box
        sx={{
          gridArea: "editor-toolbar",
        }}
      >
        {props.editorToolbar}
      </Box>
      <Box
        sx={{
          gridArea: "editor",
        }}
      >
        {props.editor}
      </Box>
    </Layout>
  );
};

const Layout = styled("div")`
  display: grid;
  height: 100%;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;

  grid-template-areas:
    "sidebar-toolbar editor-toolbar"
    "sidebar editor";
`;
