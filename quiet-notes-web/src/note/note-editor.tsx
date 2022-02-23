import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import { Suspense, useEffect, useRef, VFC } from "react";
import { Redirect } from "react-router";
import { LoadingLayout } from "../layout/loading-layout";
import { useSelectedNoteId } from "../notebook/notebook-state";
import { updateNote, useNote } from "./note-state";

export const NoteEditor = () => {
  const noteId = useSelectedNoteId();

  return noteId ? (
    <Suspense fallback={<LoadingLayout />} key={noteId}>
      <NoteEditorInternal noteId={noteId} />
    </Suspense>
  ) : null;
};

const NoteEditorInternal: VFC<{ noteId: string }> = ({ noteId }) => {
  const note = useNote(noteId);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => () => console.log("unmount"), []);

  return note === undefined ? (
    <Redirect to="/notebook" />
  ) : (
    <Box sx={{ overflow: "hidden", height: "100%", padding: "0.5rem" }}>
      <TextareaAutosize
        aria-label="a quiet note"
        ref={inputRef}
        value={note.content}
        onChange={(e) => updateNote({ ...note, content: e.target.value })}
        style={{
          resize: "none",
          width: "100%",
          height: "100%",
          overflow: "auto",
          padding: "1em",
        }}
      />
    </Box>
  );
};
