import { Button, Tooltip } from "@blueprintjs/core";
import { useEffect } from "react";
import { useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useCreateNote, useDeleteNote } from "../notebook-service/notebook-service";
import { useDeselectNote, useSelectedNoteId, useSelectNote } from "./notebook-state";
import "./notebook-toolbars.scss";

const b = block("note-editor-toolbar");

export const NoteEditorToolbar = () => {
  const selectedNoteId = useSelectedNoteId();

  return (
    <div className={b()}>
      {!!selectedNoteId && <DeleteNoteButton selectedNoteId={selectedNoteId} />}
    </div>
  );
};

const DeleteNoteButton = (props: { selectedNoteId: string }) => {
  const { mutate: deleteNote } = useDeleteNote();
  const deselectNote = useDeselectNote();

  return (
    <Tooltip content="delete note">
      <Button
        icon="trash"
        onClick={() => {
          deleteNote(props.selectedNoteId);
          deselectNote();
        }}
      />
    </Tooltip>
  );
};

export const SidebarToolbar = () => {
  const user = useUser();
  const { mutate: createNote, data } = useCreateNote();
  const selectNote = useSelectNote();

  useEffect(() => {
    data && selectNote(data);
  }, [data, selectNote]);

  return (
    <div className={b()}>
      <Tooltip content="create note">
        <Button icon={"new-object"} onClick={() => createNote(user.uid)} />
      </Tooltip>
    </div>
  );
};
