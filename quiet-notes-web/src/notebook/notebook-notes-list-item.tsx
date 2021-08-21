import { Callout, Classes } from "@blueprintjs/core";
import { truncate } from "lodash";
import { block } from "../app/bem";
import { formatDate } from "../date/format";
import { Note } from "./notebook-model";
import "./notebook-notes-list-item.scss";

const prefix = "notes-list-item";
const b = block(prefix);
export const testId = prefix;

export const defaultNoteTitle = "Untitled Note";
export const maxTitleLength = 25;
export const createdAt = (date: Date) => `Created ${formatDate(date)}`;
export const updatedAt = (date: Date) => `Updated ${formatDate(date)}`;

export interface NotesListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (noteId: string) => void;
}

export function NotesListItem({ note, isSelected, onSelect }: NotesListItemProps) {
  return (
    <Callout
      data-testid={testId}
      className={b({ isSelected }).toString()}
      intent={isSelected ? "primary" : "none"}
      icon="document"
      onClick={() => onSelect(note.id)}
      title={truncate(note.title, { length: maxTitleLength }) || defaultNoteTitle}
    >
      <p className={b("list-item-detail").mix(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
        {note._createdAt && <span>{createdAt(note._createdAt)}</span>}
        <br />
        {note._updatedAt && <span>{updatedAt(note._updatedAt)}</span>}
      </p>
    </Callout>
  );
}
