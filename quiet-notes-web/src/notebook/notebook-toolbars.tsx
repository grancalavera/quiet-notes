import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { CreateNoteButton } from "./create-note-button";
import { DeleteNoteButton } from "./delete-note-button";
import { SortMenu } from "./notebook-sort-menu";
import { useIsUpdatingNote, useOpenNoteId } from "./notebook-state";

export const NoteEditorToolbar = () => {
  const selectedNoteId = useOpenNoteId();
  const isUpdatingNote = useIsUpdatingNote();

  return (
    <Layout>
      {isUpdatingNote && <CircularProgress size={15} sx={{ mt: 1.6, mr: 1 }} />}
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
