import { Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { truncate } from "lodash";
import { DeleteNoteButton } from "../components/DeleteNoteButton";
import { formatDate } from "../date/format";
import { usePrevious } from "../utils/use-previous";
import { deriveTitle, Note } from "./notebook-model";

export const testId = "notes-list-item";
export const defaultNoteTitle = "Untitled Note";
export const maxTitleLength = 40;

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
    <Card sx={{ mb: 1 }}>
      <CardActionArea data-testid={testId} onClick={() => onSelect(note.id)}>
        <CardHeader
          title={
            truncate(deriveTitle(note), { length: maxTitleLength }) || defaultNoteTitle
          }
          action={<DeleteNoteButton noteId={note.id} isSelected={isSelected} />}
          titleTypographyProps={{ sx: { fontSize: 20 } }}
        ></CardHeader>

        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            {createdAt(note._createdAt ?? previous?._createdAt)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {updatedAt(note._updatedAt ?? previous?._updatedAt)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
