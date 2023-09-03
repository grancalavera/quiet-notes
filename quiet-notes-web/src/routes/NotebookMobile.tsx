import { Box, Drawer, Skeleton, Stack } from "@mui/material";
import { withSubscribe } from "../lib/with-subscribe";
import { NoteEditorInternal, NoteTitle } from "../note/note-editor";
import { NotesList } from "../notebook/notebook-notes-list";
import { closeMainNote, useMainNoteId } from "../notebook/notebook-state";
import { NotebookListToolbar } from "../toolbars/notebook-list-toolbar";
import { NotebookToolbarLayout } from "../toolbars/notebook-toolbar-layout";
import { NotebookToolbarButton } from "../toolbars/notebook-toolbar-button";
import { DuplicateNoteButton } from "../toolbars/duplicate-note-button";

export default () => (
  <>
    <Stack sx={{ height: "100%" }}>
      <NotebookListToolbar />
      <NotesList />
    </Stack>
    <NoteEditorDrawer />
  </>
);

const NoteEditorDrawer = withSubscribe(() => {
  const noteId = useMainNoteId();
  return (
    <Drawer anchor="right" open={!!noteId}>
      {noteId ? <NoteEditor noteId={noteId} /> : <NoteEditorSkeleton />}
    </Drawer>
  );
});

const NoteEditorSkeleton = () => (
  <NoteEditorLayout
    toolbar={<Skeleton variant="rounded" height="44px" />}
    editor={<Skeleton variant="rounded" height="100%" />}
  />
);

type NoteEditorProps = { noteId: string };

const NoteEditor = withSubscribe(
  ({ noteId }: NoteEditorProps) => {
    return (
      <NoteEditorLayout
        toolbar={
          <NotebookToolbarLayout title={<NoteTitle noteId={noteId} />}>
            <DuplicateNoteButton noteId={noteId} />
            <NotebookToolbarButton
              loading={false}
              title="Close"
              onClick={() => closeMainNote()}
              kind="close"
            />
          </NotebookToolbarLayout>
        }
        editor={<NoteEditorInternal noteId={noteId} kind="main" />}
      />
    );
  },
  { fallback: <NoteEditorSkeleton /> }
);

interface NoteEditorLayoutProps {
  toolbar?: React.ReactNode;
  editor?: React.ReactNode;
}

const NoteEditorLayout = ({ toolbar, editor }: NoteEditorLayoutProps) => (
  <Stack
    data-testid="note-editor-layout-mobile"
    width="100vw"
    height="100vh"
    gap={1}
    overflow="hidden"
    padding={1}
  >
    <Box>{toolbar}</Box>
    <Box flex={1}>{editor}</Box>
  </Stack>
);
