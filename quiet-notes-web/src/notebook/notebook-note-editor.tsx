import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import { Suspense, useEffect, useRef, VFC } from "react";
import { CenterLayout } from "../layout/center-layout";
import { LoadingLayout } from "../layout/loading-layout";
import { CreateNoteButton } from "./create-note-button";
import {
  setNoteContent,
  setNoteId,
  useNote,
  useOpenNoteId,
  useUpdateNote,
} from "./notebook-state";

export const NoteEditor = () => {
  const noteId = useOpenNoteId();

  useEffect(() => {
    noteId && setNoteId(noteId);
  }, [noteId]);

  return noteId ? (
    <Suspense fallback={<LoadingLayout />}>
      <NoteEditorInternal key={noteId} />
    </Suspense>
  ) : (
    <CenterLayout>
      <CreateNoteButton showLabel />
    </CenterLayout>
  );
};

const NoteEditorInternal: VFC = () => {
  useUpdateNote();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const note = useNote();

  useEffect(() => inputRef.current?.focus(), []);

  useEffect(() => {
    return () => {
      setNoteId(undefined);
    };
  }, []);

  return (
    <Box sx={{ overflow: "hidden", height: "100%", padding: "0.5rem" }}>
      <TextareaAutosize
        aria-label="a quiet note"
        ref={inputRef}
        value={note.content}
        onChange={(e) => setNoteContent(e.target.value)}
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
