import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { useEffect } from "react";
import { useNotImplementedError, useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useCreateNote } from "../notebook-service/notebook-service";
import { useNotebookState } from "./notebook-state";
import { useDeleteNote } from "../notebook-service/notebook-service";

import "./notebook-toolbars.scss";

const b = block("toolbar");

export const EditorToolbar = () => {
  const hasSelectedNote = useNotebookState((s) => !!s.selectedNoteId);
  return (
    <div className={b()}>
      {!!hasSelectedNote && (
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

  const selectedNoteId = useNotebookState((s) => s.selectedNoteId);
  const deselectNote = useNotebookState((s) => s.deselectNote);

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
  const selectNote = useNotebookState((s) => s.selectNote);

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
