import ButtonGroup from "@mui/material/ButtonGroup";
import { styled } from "@mui/material/styles";
import { CreateNoteButton } from "./create-note-button";
import { DeleteNoteButton } from "./delete-note-button";
import { SortMenu } from "./notebook-sort-menu";

export const NotebookEditorToolbar = () => {
  return (
    <Layout>
      <ButtonGroup>
        <DeleteNoteButton />
        <CreateNoteButton />
      </ButtonGroup>
    </Layout>
  );
};

export const NotebookSidebarToolbar = () => (
  <Layout>
    <SortMenu />
  </Layout>
);

const Layout = styled("div")`
  height: 100%;
  padding: 0.5rem;
  padding-bottom: 0;
  display: flex;
  justify-content: flex-end;
`;
