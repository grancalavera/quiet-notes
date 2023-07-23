import { Skeleton, Stack, styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Subscribe } from "@react-rxjs/core";
import { useEffect, useRef } from "react";
import { withSubscribe } from "../lib/with-subscribe";
import { useNoteTitle } from "../note/note-state";
import {
  EditorKind,
  selectEditor,
  useIsSelectedEditor,
  useNoteIdByEditorKind,
} from "../notebook/notebook-state";
import { CloseAdditionalNoteButton } from "../toolbars/close-additional-note-button";
import { DuplicateNoteButton } from "../toolbars/duplicate-note-button";
import { NotebookToolbarLayout } from "../toolbars/notebook-toolbar-layout";
import { OpenAdditionalNoteButton } from "../toolbars/open-additional-note-button";
import { NoteEditorLayout } from "./note-editor-layout";
import { updateNote, useNote } from "./note-state";

type WithNoteId = { noteId: string };
type WithEditorKind = { kind: EditorKind };
type NoteEditorProps = WithNoteId & WithEditorKind;

export const NoteEditorGroup = () => (
  <StyledNoteEditorGroup data-testid="note-editor-group" direction={"row"}>
    <NoteEditor kind="main" />
    <NoteEditor kind="additional" />
  </StyledNoteEditorGroup>
);

const NoteEditor = withSubscribe(({ kind }: WithEditorKind) => {
  const noteId = useNoteIdByEditorKind(kind);
  const selected = useIsSelectedEditor(kind);
  return noteId ? (
    <Subscribe fallback={<NoteEditorSkeleton />}>
      <NoteEditorLayout
        selected={selected}
        onFocus={() => selectEditor(kind)}
        toolbar={<NoteEditorToolbar {...{ noteId, kind }} />}
        editor={<NoteEditorInternal {...{ noteId, kind }} />}
      />
    </Subscribe>
  ) : null;
});

const NoteEditorToolbar = ({ noteId, kind }: NoteEditorProps) => (
  <NotebookToolbarLayout title={<NoteTitle {...{ noteId, kind }} />}>
    <DuplicateNoteButton noteId={noteId} />
    {kind === "main" ? (
      <OpenAdditionalNoteButton noteId={noteId} />
    ) : (
      <CloseAdditionalNoteButton />
    )}
  </NotebookToolbarLayout>
);

const NoteTitle = withSubscribe(({ noteId }: NoteEditorProps) => {
  const title = useNoteTitle(noteId);
  return (
    <Typography
      variant="h6"
      sx={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        paddingInlineStart: 1,
      }}
    >
      {title}
    </Typography>
  );
});

const NoteEditorInternal = ({ noteId, kind }: NoteEditorProps) => {
  const note = useNote(noteId);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const selected = useIsSelectedEditor(kind);

  const focus = useRef(() => {
    const textArea = inputRef.current;
    if (textArea) {
      const end = textArea.value.length;
      textArea.focus();
      textArea.setSelectionRange(end, end);
    }
  });

  useEffect(() => {
    focus.current();
  }, []);

  useEffect(() => {
    selected && focus.current();
  }, [selected]);

  return note ? (
    <Stack height="100%" width="100%">
      <Spacer />
      <StyledTextArea
        aria-label="a quiet note"
        data-testid={`note-editor-${kind}`}
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

const NoteEditorSkeleton = () => (
  <NoteEditorLayout
    toolbar={
      <Skeleton
        sx={{ height: 48, marginRight: 1, marginTop: 1 }}
        variant="rounded"
      />
    }
    editor={
      <Skeleton sx={{ height: "100%", marginRight: 1 }} variant="rounded" />
    }
  />
);

const StyledNoteEditorGroup = styled(Stack)`
  height: 100%;
  width: 100%;
  gap: ${(p) => p.theme.spacing(1)};
  padding: ${(p) => p.theme.spacing(1)};
  padding-inline-end: ${(p) => p.theme.spacing(2)};
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
