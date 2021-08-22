import { NonIdealState, Spinner } from "@blueprintjs/core";
import { useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useNotesCollection } from "../notebook-service/notebook-service";
import { NotesListItem } from "./notebook-notes-list-item";
import "./notebook-notes-list.scss";

export const b = block("notes-list");
export const testId = b().toString();

export const NotesList = () => {
  const user = useUser();
  const [notes, isLoading] = useNotesCollection(user.uid);

  return (
    <div className={b()} data-testid={testId}>
      {notes &&
        notes.length > 0 &&
        notes.map((note) => (
          <NotesListItem
            note={note}
            key={note.id}
            isSelected={true}
            onSelect={() => {}}
          />
        ))}
      {!isLoading && !notes && <NonIdealNotesList />}
      {!isLoading && notes?.length === 0 && <NonIdealNotesList />}
      {isLoading && <Spinner />}
    </div>
  );
};

const NonIdealNotesList = () => (
  <NonIdealState icon="warning-sign" title="Create a new note" />
);
