import { Spinner } from "@blueprintjs/core";
import { ReactNode, useEffect } from "react";
import { useUser } from "../app/app-state";
import { block } from "../app/bem";
import { CreateNoteButton } from "../components/CreateNoteButton";
import { CenterLayout } from "../layout/center-layout";
import { useNotesCollection } from "../notebook-service/notebook-service";
import { NotesListItem } from "./notebook-notes-list-item";
import "./notebook-notes-list.scss";
import {
  useLoadNotes,
  useNotebookNotes,
  useSelectedNoteId,
  useSelectNote,
} from "./notebook-state";

export const b = block("notes-list");
export const testId = b().toString();

export const NotesList = () => {
  const user = useUser();
  const [notes, isLoading] = useNotesCollection(user.uid);
  const selectedNoteId = useSelectedNoteId();
  const selectNote = useSelectNote();

  const notebookNotes = useNotebookNotes();
  const loadNotes = useLoadNotes();

  useEffect(() => {
    notes && loadNotes(notes);
  }, [notes, loadNotes]);

  let children: ReactNode;

  if (isLoading) {
    children = <Spinner />;
  } else if (notes && notes.length > 0) {
    children = (
      <>
        {notebookNotes.map((note) => (
          <NotesListItem
            note={note}
            key={note.id}
            isSelected={note.id === selectedNoteId}
            onSelect={() => selectNote(note.id)}
          />
        ))}
      </>
    );
  } else {
    children = (
      <CenterLayout>
        <CreateNoteButton showLabel />
      </CenterLayout>
    );
  }

  return (
    <div className={b()} data-testid={testId}>
      {children}
    </div>
  );
};
