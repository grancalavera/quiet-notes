import {
  ButtonGroup,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { formatDate } from "../lib/date-format";
import { usePrevious } from "../lib/use-previous";
import { withSubscribe } from "../lib/with-subscribe";
import { DeleteNoteButton } from "../toolbars/delete-note-button";
import { DuplicateNoteButton } from "../toolbars/duplicate-note-button";
import { Note, deriveTitle } from "./notebook-model";
import { openNote, useIsNoteOpen } from "./notebook-state";

export const defaultNoteTitle = "Untitled Note";
export const maxTitleLength = 27;

export const createdAt = (date?: Date) =>
  date ? `Created ${formatDate(date)}` : "\u00A0";

export const updatedAt = (date?: Date) =>
  date ? `Updated ${formatDate(date)}` : "\u00A0";

export interface NotesListItemProps {
  note: Note;
}

const NotesListItemLayout = (props: {
  title: ReactNode;
  createdAt: ReactNode;
  updatedAt: ReactNode;
  actions: ReactNode;

  isOpen?: boolean;
  onClick?: () => void;
}) => (
  <Card
    sx={{ mb: 1, bgcolor: props.isOpen ? "action.selected" : "" }}
    aria-current={props.isOpen ? "true" : "false"}
  >
    <CardActionArea onClick={() => props.onClick?.()}>
      <CardContent>
        <Typography gutterBottom variant="h6" noWrap>
          {props.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {props.createdAt}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {props.updatedAt}
        </Typography>
      </CardContent>
    </CardActionArea>

    {/* change to https://mui.com/components/menus/#context-menu */}
    <CardActions sx={{ justifyContent: "flex-end" }}>
      {props.actions}
    </CardActions>
  </Card>
);

export const NotesListItem = withSubscribe(
  ({ note }: NotesListItemProps) => {
    const isOpen = useIsNoteOpen(note.id);

    const previous = usePrevious({
      _createdAt: note._createdAt,
      _updatedAt: note._updatedAt,
    });

    return (
      <NotesListItemLayout
        isOpen={isOpen}
        onClick={() => openNote(note.id)}
        title={deriveTitle(note) || defaultNoteTitle}
        createdAt={createdAt(note._createdAt ?? previous?._createdAt)}
        updatedAt={updatedAt(note._updatedAt ?? previous?._updatedAt)}
        actions={
          <ButtonGroup>
            <DuplicateNoteButton noteId={note.id} />
            <DeleteNoteButton noteId={note.id} />
          </ButtonGroup>
        }
      />
    );
  },
  { fallback: null }
);
