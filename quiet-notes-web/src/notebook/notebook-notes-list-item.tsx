import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { formatDate } from "../date/format";
import { usePrevious } from "../utils/use-previous";
import { deriveTitle, Note } from "./notebook-model";

export const tid = {
  component: "notes-list-item",
  trigger: "notes-list-item-trigger",
};

export const defaultNoteTitle = "Untitled Note";
export const maxTitleLength = 27;

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
  const previous = usePrevious({
    _createdAt: note._createdAt,
    _updatedAt: note._updatedAt,
  });

  return (
    <Card
      sx={{ mb: 1, bgcolor: isSelected ? "action.selected" : "" }}
      aria-current={isSelected ? "true" : "false"}
      data-testid={tid.component}
    >
      <CardActionArea onClick={() => onSelect(note.id)} data-testid={tid.trigger}>
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
      {/* <CardActions sx={{ justifyContent: "flex-end" }}>
        <DeleteNoteButton noteId={note.id} isSelected={isSelected} />
      </CardActions> */}
    </Card>
  );
}
