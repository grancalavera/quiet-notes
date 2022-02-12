import { FC } from "react";
import { useParams } from "react-router";
import { CenterLayout } from "../layout/center-layout";
import { withSubscribe } from "../lib/with-subscribe";
import { CreateNoteButton } from "../notebook/create-note-button";
import { useNoteById } from "./note-state";

export const NoteEditor = () => {
  const noteId = useParams<{ noteId?: string }>().noteId;

  console.log({ noteId });

  return noteId ? (
    <NoteEditorWithSubscription noteId={noteId} key={noteId} />
  ) : (
    <CenterLayout>
      <CreateNoteButton showLabel />
    </CenterLayout>
  );
};

const Editor: FC<{ noteId: string }> = ({ noteId }) => {
  const note = useNoteById(noteId);
  return <pre>{JSON.stringify(note, null, 2) ?? "Nothing"}</pre>;
};

const NoteEditorWithSubscription = withSubscribe(Editor);
