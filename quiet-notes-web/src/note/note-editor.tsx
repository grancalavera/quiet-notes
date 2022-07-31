import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import { Subscribe } from "@react-rxjs/core";
import { useEffect, useRef, VFC } from "react";
import { Redirect, useLocation } from "react-router";
import { useErrorHandler } from "../app/app-error-state";
import { LoadingLayout } from "../layout/loading-layout";
import { isLoadFailure } from "../lib/load-result";
import { useSelectedNoteId } from "../notebook/notebook-state";
import { saveNote, updateNote, useNoteById, useSaveNoteResult } from "./note-state";

export const NoteEditor = () => {
  const noteId = useSelectedNoteId();

  return noteId ? (
    <Subscribe fallback={<LoadingLayout />} key={noteId}>
      <NoteEditorInternal noteId={noteId} />
    </Subscribe>
  ) : null;
};

const NoteEditorInternal: VFC<{ noteId: string }> = ({ noteId }) => {
  const note = useNoteById(noteId);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const result = useSaveNoteResult();
  const handleError = useErrorHandler();

  useEffect(() => {
    isLoadFailure(result) && handleError(result.error);
  }, [result]);

  useEffect(() => {
    if (note !== undefined) {
      saveNote(note);
    } else {
      console.log("should navigate away");
    }
  }, [note]);

  return note === undefined ? (
    <Redirect to="/notebook" />
  ) : (
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
  );
};
