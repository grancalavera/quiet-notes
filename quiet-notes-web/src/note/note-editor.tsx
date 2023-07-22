import { Stack, styled } from "@mui/material";
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
    <StyledNoteEditor className="qn-note-editor" direction={"row"} minWidth={0}>
      <MainNoteEditor />
      <AdditionalNoteEditor />
    </StyledNoteEditor>
  );
};

const MainNoteEditor = () => {
  const noteId = useMainNoteId();
  return noteId ? (
    <Subscribe fallback={<Loading />}>
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
    <Subscribe fallback={<Loading />}>
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
    <Stack height="100%" width="100%">
      <Spacer />
      <StyledTextArea
        aria-label="a quiet note"
        ref={inputRef}
        value={note.content}
        onChange={(e) => {
          updateNote({ ...note, content: e.target.value });
        }}
      />
      <Spacer />
    </Stack>
  ) : null;
};

const StyledNoteEditor = styled(Stack)`
  height: 100%;
  width: 100%;
  gap: ${(p) => p.theme.spacing(1)};
  padding: ${(p) => p.theme.spacing(1)};
  padding-top: 0;
  background-color: ${(p) =>
    p.theme.palette.mode === "dark"
      ? p.theme.palette.grey[900]
      : p.theme.palette.grey[200]};
`;

const StyledTextArea = styled("textarea")`
  resize: none;
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 ${(p) => p.theme.spacing(2)};
  color: ${(p) => p.theme.palette.text.primary};
  background-color: ${(p) => p.theme.palette.background.paper};
  outline: none;
  padding-bottom: 100px;
  flex-grow: 1;
`;

const Spacer = styled("div")`
  height: ${(p) => p.theme.spacing(2)};
  background-color: ${(p) => p.theme.palette.background.paper};
`;
