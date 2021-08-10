import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { useEffect } from "react";
import { useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useCreateNote } from "../notebook-service/notebook-service";
import { useNotebookState } from "./notebook-local-state";
import { deleteNote } from "./notebook-server-state";
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
  const selectedNoteId = useNotebookState((s) => s.selectedNoteId);
  const closeNote = useNotebookState((s) => s.closeNote);
  return (
    <>
      {selectedNoteId && (
        <Button
          icon="trash"
          onClick={() => {
            deleteNote(selectedNoteId);
            closeNote();
          }}
        />
      )}
    </>
  );
};

const SaveNoteButton = () => {
  const isDisabled = useNotebookState((s) => s.editor.kind !== "NoteDraft");
  const isSaving = useNotebookState((s) => s.isSaving);
  const saveNote = useNotebookState((s) => s.save);
  return (
    <Button
      icon="floppy-disk"
      disabled={isDisabled}
      onClick={saveNote}
      loading={isSaving}
    />
  );
};

const CloseNoteButton = () => {
  const closeNote = useNotebookState((s) => s.closeNote);
  return <Button icon="cross" onClick={closeNote} />;
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
