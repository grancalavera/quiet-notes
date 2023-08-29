import { Box, Drawer, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { withSubscribe } from "../lib/with-subscribe";
import { NoteEditorMobile } from "../note/note-editor";
import { NotesList } from "../notebook/notebook-notes-list";
import { closeMainNote, useMainNoteId } from "../notebook/notebook-state";
import { NotebookListToolbar } from "../toolbars/notebook-list-toolbar";

export default () => (
  <>
    <Stack sx={{ height: "100%" }}>
      <NotebookListToolbar />
      <NotesList />
    </Stack>
    <NoteEditor />
  </>
);

const NoteEditor = withSubscribe(() => {
  const [open, setOpen] = useState(false);
  const noteId = useMainNoteId();

  useEffect(() => {
    if (noteId) setOpen(true);
  }, [noteId]);

  return (
    <Drawer anchor="right" open={open} onClose={() => closeMainNote()}>
      <NoteEditorMobile onClose={() => setOpen(false)} />
    </Drawer>
  );
});
