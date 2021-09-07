import { NonIdealState, TextArea } from "@blueprintjs/core";
import { useEffect, useRef, useState } from "react";
import { block } from "../app/bem";
import { useNote } from "../notebook-service/notebook-service";
import "./notebook-note-editor.scss";
import { useSelectedNoteId } from "./notebook-state";

const b = block("note-editor");

export const NoteEditorContainer = () => {
  const selectedNoteId = useSelectedNoteId();

  return selectedNoteId ? (
    <NoteEditor noteId={selectedNoteId} key={selectedNoteId} />
  ) : (
    <NonIdealState
      icon="warning-sign"
      title="Select an existing note or create a new one"
    />
  );
};

const NoteEditor = (props: { noteId: string }) => {
  const [note] = useNote(props.noteId);
  const [draft, setDraft] = useState(note?.content ?? "");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [note]);

  return (
    <div className={b()}>
      {note && (
        <TextArea
          inputRef={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          fill
        />
      )}
    </div>
  );
};
