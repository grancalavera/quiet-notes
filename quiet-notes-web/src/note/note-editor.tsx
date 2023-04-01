import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import { Subscribe } from "@react-rxjs/core";
import { FC, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/loading";
import { useSelectedNoteId, useSidebarNote } from "../notebook/notebook-state";
import { updateNote, useNote } from "./note-state";

export const DefaultNoteEditor = () => {
  const noteId = useSelectedNoteId();

  return noteId ? (
    <Subscribe fallback={<Loading />} key={noteId}>
      <NoteEditorInternal noteId={noteId} />
    </Subscribe>
  ) : null;
};

export const SidebarNoteEditor = () => {
  const noteId = useSidebarNote();

  return noteId ? (
    <Subscribe fallback={<Loading />} key={noteId}>
      <NoteEditorInternal noteId={noteId} />
    </Subscribe>
  ) : null;
};

const NoteEditorInternal: FC<{ noteId: string }> = ({ noteId }) => {
  const note = useNote(noteId);
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
    <Navigate to="/notebook" />
  );
};
