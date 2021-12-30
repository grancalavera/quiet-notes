import { ButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CreateNoteButton } from "../components/CreateNoteButton";
import { DeleteNoteButton } from "../components/DeleteNoteButton";
import { useOpenNoteId } from "./notebook-state";
import { SortMenu } from "./notebook-sort-menu";

export const NoteEditorToolbar = () => {
  const selectedNoteId = useOpenNoteId();
  return (
    <Layout>
      <ButtonGroup>
        {selectedNoteId && <DeleteNoteButton noteId={selectedNoteId} isOpen={true} />}
        <CreateNoteButton />
      </ButtonGroup>
    </Layout>
  );
};

export const SidebarToolbar = () => (
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
