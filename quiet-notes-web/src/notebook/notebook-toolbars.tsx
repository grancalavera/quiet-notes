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
          <DeleteNoteButton />
          <SaveNoteButton />
          <CloseNoteButton />
        </ButtonGroup>
      )}
    </div>
  );
};

const DeleteNoteButton = () => {
  const { mutate: deleteNote } = useDeleteNote();
  const selectedNoteId = useSelectedNoteId();
  const deselectNote = useDeselectNote();

  return (
    <>
      {selectedNoteId && (
        <Button
          icon="trash"
          onClick={() => {
            deleteNote(selectedNoteId);
            deselectNote();
          }}
        />
      )}
    </>
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
