import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import { Subscribe } from "@react-rxjs/core";
import { useEffect, useRef, VFC } from "react";
import { Redirect } from "react-router";
import { LoadingLayout } from "../layout/loading-layout";
import { useSelectedNoteId } from "../notebook/notebook-state";
import { note$, openNote, updateNote, useNote } from "./note-state";

export const NoteEditor = () => {
  const noteId = useSelectedNoteId();

  useEffect(() => {
    noteId && openNote(noteId);
  }, [noteId]);

  return noteId ? (
    <Subscribe fallback={<LoadingLayout />} key={noteId} source$={note$}>
      <NoteEditorInternal />
    </Subscribe>
  ) : null;
};

const NoteEditorInternal: VFC = () => {
  const note = useNote();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  return note ? (
    <Box sx={{ overflow: "hidden", height: "100%", padding: "0.5rem" }}>
      <TextareaAutosize
        aria-label="a quiet note"
        ref={inputRef}
        value={note.content}
        onChange={(e) => {
          updateNote({ ...note, content: e.target.value });
        }}
        style={{
          resize: "none",
          width: "100%",
          height: "100%",
          overflow: "auto",
          padding: "1em",
        }}
      />
    </Box>
  ) : (
    <Redirect to="/notebook" />
  );
};
