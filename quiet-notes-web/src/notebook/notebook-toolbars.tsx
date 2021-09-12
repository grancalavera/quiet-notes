import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { useEffect } from "react";
import { useNotImplementedError, useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useCreateNote, useDeleteNote } from "../notebook-service/notebook-service";
import { useDeselectNote, useSelectedNoteId, useSelectNote } from "./notebook-state";
import "./notebook-toolbars.scss";

const b = block("toolbar");

export const EditorToolbar = () => {
  const selectedNoteId = useSelectedNoteId();

  return (
    <div className={b()}>
      {!!selectedNoteId && (
        <ButtonGroup>
          <DeleteNoteButton selectedNoteId={selectedNoteId} />
          <SaveNoteButton />
          <CloseNoteButton />
        </ButtonGroup>
      )}
    </div>
  );
};

const DeleteNoteButton = (props: { selectedNoteId: string }) => {
  const { mutate: deleteNote } = useDeleteNote();
  const deselectNote = useDeselectNote();

  return (
    <Button
      icon="trash"
      onClick={() => {
        deleteNote(props.selectedNoteId);
        deselectNote();
      }}
    />
  );
};

const SaveNoteButton = () => {
  const notImplemented = useNotImplementedError("save note");
  return <Button icon="floppy-disk" onClick={notImplemented} />;
};

const CloseNoteButton = () => {
  const notImplemented = useNotImplementedError("close note");
  return <Button icon="cross" onClick={notImplemented} />;
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
