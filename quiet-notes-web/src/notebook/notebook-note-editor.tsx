import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import { Suspense, useEffect, useRef, VFC } from "react";
import { CreateNoteButton } from "../components/CreateNoteButton";
import { CenterLayout } from "../layout/center-layout";
import { LoadingLayout } from "../layout/loading-layout";
import {
  changeNoteContent,
  loadNoteById,
  useNote,
  useOpenNoteId,
} from "./notebook-state";

export const NoteEditor = () => {
  const noteId = useOpenNoteId();

  useEffect(() => {
    noteId && loadNoteById(noteId);
  }, [noteId]);

  return noteId ? (
    <Suspense fallback={<LoadingLayout />}>
      <NoteEditorInternal />
    </Suspense>
  ) : (
    <CenterLayout>
      <CreateNoteButton showLabel />
    </CenterLayout>
  );
};

const NoteEditorInternal: VFC = () => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => inputRef.current?.focus(), []);
  const note = useNote();

  return (
    <Box sx={{ overflow: "hidden", height: "100%", padding: "0.5rem" }}>
      <TextareaAutosize
        aria-label="a quiet note"
        ref={inputRef}
        value={note.content}
        onChange={(e) => changeNoteContent(e.target.value)}
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
