import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { formatDate } from "../lib/date-format";
import { usePrevious } from "../lib/use-previous";
import { DeleteNoteButton } from "../toolbars/delete-note-button";
import { DuplicateNoteButton } from "../toolbars/duplicate-note-button";
import { OpenAdditionalNoteButton } from "../toolbars/open-additional-note-button";
import { Note, deriveTitle } from "./notebook-model";
import { openMainNote, useIsNoteOpen } from "./notebook-state";

export const defaultNoteTitle = "Untitled Note";
export const maxTitleLength = 27;

export const createdAt = (date?: Date) =>
  date ? `Created ${formatDate(date)}` : "\u00A0";

export const updatedAt = (date?: Date) =>
  date ? `Updated ${formatDate(date)}` : "\u00A0";

export interface NotesListItemProps {
  note: Note;
}

export const NotesListItem = ({ note }: NotesListItemProps) => {
  const isOpen = useIsNoteOpen(note.id);

  const previous = usePrevious({
    _createdAt: note._createdAt,
    _updatedAt: note._updatedAt,
  });

  return (
    <Card
      sx={{ mb: 1, bgcolor: isOpen ? "action.selected" : "" }}
      aria-current={isOpen ? "true" : "false"}
    >
      <CardActionArea onClick={() => openMainNote(note.id)}>
        <CardContent>
          <Typography gutterBottom variant="h6" noWrap>
            {deriveTitle(note) || defaultNoteTitle}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {createdAt(note._createdAt ?? previous?._createdAt)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {updatedAt(note._updatedAt ?? previous?._updatedAt)}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* change to https://mui.com/components/menus/#context-menu */}
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <DuplicateNoteButton noteId={note.id} onDuplicated={openMainNote} />
        <OpenAdditionalNoteButton noteId={note.id} />
        <DeleteNoteButton noteId={note.id} />
      </CardActions>
    </Card>
  );
};
