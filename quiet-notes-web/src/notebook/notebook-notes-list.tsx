import { useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useNotesCollection } from "../notebook-service/notebook-service";
import { NotesListItem } from "./notebook-notes-list-item";
import "./notebook-notes-list.scss";

const b = block("notes-list");

export const NotesList = () => {
  const user = useUser();
  const [notes] = useNotesCollection(user.uid);

  return notes ? (
    <div className={b()}>
      {notes.map((note) => (
        <NotesListItem note={note} key={note.id} isSelected={true} onSelect={() => {}} />
      ))}
    </div>
  ) : null;
};
