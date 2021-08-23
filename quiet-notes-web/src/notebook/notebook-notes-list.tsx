import { NonIdealState, Spinner } from "@blueprintjs/core";
import { ReactNode } from "react";
import { useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useNotesCollection } from "../notebook-service/notebook-service";
import { NotesListItem } from "./notebook-notes-list-item";
import "./notebook-notes-list.scss";
import { useNotebookState } from "./notebook-state";

export const b = block("notes-list");
export const testId = b().toString();

export const NotesList = () => {
  const user = useUser();
  const [notes, isLoading] = useNotesCollection(user.uid);
  const selectNote = useNotebookState((s) => s.selectNote);
  const selectedNoteId = useNotebookState((s) => s.selectedNoteId);

  let children: ReactNode;

  if (isLoading) {
    children = <Spinner />;
  } else if (notes && notes.length > 0) {
    children = (
      <>
        {notes.map((note) => (
          <NotesListItem
            note={note}
            key={note.id}
            isSelected={note.id === selectedNoteId}
            onSelect={() => {
              selectNote(note.id);
            }}
          />
        ))}
      </>
    );
  } else {
    children = <NonIdealState icon="warning-sign" title="Create a new note" />;
  }

  return (
    <div className={b()} data-testid={testId}>
      {children}
    </div>
  );
};
