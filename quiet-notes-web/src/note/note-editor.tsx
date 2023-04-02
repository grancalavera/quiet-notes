import { Stack, TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import { Subscribe } from "@react-rxjs/core";
import { useEffect, useRef } from "react";
import { Loading } from "../components/loading";
import { useAdditionalNoteId, useMainNoteId } from "../notebook/notebook-state";
import {
  AdditionalNoteEditorToolbar,
  MainNoteEditorToolbar,
} from "../toolbars/note-editor-toolbar";
import { NoteEditorLayout } from "./note-editor-layout";
import { updateNote, useNote } from "./note-state";

export const NoteEditor = () => {
  return (
    <Stack direction={"row"} width="100%" height="100%" gap={1} padding={1}>
      <MainNoteEditor />
      <AdditionalNoteEditor />
    </Stack>
  );
};

const MainNoteEditor = () => {
  const noteId = useMainNoteId();
  return noteId ? (
    <Subscribe fallback={<Loading />} key={noteId}>
      <NoteEditorLayout
        editor={<NoteEditorInternal noteId={noteId} />}
        toolbar={<MainNoteEditorToolbar noteId={noteId} />}
      />
    </Subscribe>
  ) : null;
};

const AdditionalNoteEditor = () => {
  const noteId = useAdditionalNoteId();
  return noteId ? (
    <Subscribe fallback={<Loading />} key={noteId}>
      <NoteEditorLayout
        editor={<NoteEditorInternal noteId={noteId} />}
        toolbar={<AdditionalNoteEditorToolbar noteId={noteId} />}
      />
    </Subscribe>
  ) : null;
};

const NoteEditorInternal = ({ noteId }: { noteId: string }) => {
  const note = useNote(noteId);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textArea = inputRef.current;
    if (textArea) {
      const end = textArea.value.length;
      textArea.focus();
      textArea.setSelectionRange(end, end);
    }
  }, []);

  return note ? (
    <Box
      sx={{
        overflow: "hidden",
        height: "100%",
      }}
    >
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
  ) : null;
};
