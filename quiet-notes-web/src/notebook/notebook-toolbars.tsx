import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { block } from "../app/bem";
import { useDeleteNote } from "../notebook-service/notebook-service";
import { CreateNoteButton } from "./CreateNoteButton";
import { useDeselectNote, useSelectedNoteId } from "./notebook-state";
import "./notebook-toolbars.scss";
import { SortMenu } from "./SortNotesMenu";

const b = block("note-editor-toolbar");

export const NoteEditorToolbar = () => {
  const selectedNoteId = useSelectedNoteId();

  return (
    <div className={b()}>
      {!!selectedNoteId && <DeleteNoteButton noteId={selectedNoteId} deselect />}
    </div>
  );
};

export const DeleteNoteButton = (props: {
  noteId: string;
  className?: string;
  minimal?: boolean;
  deselect: boolean;
}) => {
  const { mutate: deleteNote } = useDeleteNote();
  const deselectNote = useDeselectNote();

  return (
    <Tooltip content="delete note">
      <Button
        minimal={props.minimal}
        className={props.className?.toString()}
        icon="trash"
        onClick={(e) => {
          e.stopPropagation();
          deleteNote(props.noteId);
          props.deselect && deselectNote();
        }}
      />
    </Tooltip>
  );
};

export const SidebarToolbar = () => (
  <div className={b()}>
    <ButtonGroup>
      <SortMenu />
      <CreateNoteButton />
    </ButtonGroup>
  </div>
);
