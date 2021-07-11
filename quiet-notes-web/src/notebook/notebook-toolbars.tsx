import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { block } from "../app/bem";
import { useCreateNote, useNotebookState } from "./notebook-local-state";
import { deleteNote } from "./notebook-server-state";
import "./notebook-toolbars.scss";

const b = block("toolbar");

export const EditorToolbar = () => {
  const selectedNote = useNotebookState((s) => s.selectedNoteId);

  return (
    <div className={b()}>
      {!!selectedNote && (
        <ButtonGroup>
          <Button icon="trash" onClick={() => deleteNote(selectedNote)} />
          <SaveNoteButton />
          <Button icon="cross" />
        </ButtonGroup>
      )}
    </div>
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

export const SidebarToolbar = () => {
  const createNote = useCreateNote();
  return (
    <div className={b()}>
      <Tooltip content="create note">
        <Button icon={"new-object"} onClick={createNote} />
      </Tooltip>
    </div>
  );
};
