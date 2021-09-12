import { Callout, Classes } from "@blueprintjs/core";
import { truncate } from "lodash";
import { block } from "../app/bem";
import { formatDate } from "../date/format";
import { deriveTitle, Note } from "./notebook-model";
import "./notebook-notes-list-item.scss";

export const b = block("notes-list-item");
export const testId = b().toString();
export const defaultNoteTitle = "Untitled Note";
export const maxTitleLength = 25;

export const createdAt = (date?: Date) =>
  date ? `Created ${formatDate(date)}` : "\u00A0";

export const updatedAt = (date?: Date) =>
  date ? `Updated ${formatDate(date)}` : "\u00A0";

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
      title={truncate(deriveTitle(note), { length: maxTitleLength }) || defaultNoteTitle}
    >
      <p className={b("list-item-detail").mix(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
        <span>{createdAt(note._createdAt)}</span>
        <br />
        <span>{updatedAt(note._updatedAt)}</span>
      </p>
    </Callout>
  );
}
