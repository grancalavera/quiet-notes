import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { block } from "../app/bem";
import {
  useCreateNote,
  useNotebookState,
  useNoteEditorState,
} from "./notebook-local-state";
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
  const isDisabled = useNoteEditorState((s) => s.editor.kind !== "NoteDraft");
  return <Button icon="floppy-disk" disabled={isDisabled} />;
};

export const SidebarToolbar = () => {
  const createNote = useCreateNote();
  return (
    <div className={b()}>
      <Tooltip content="create note">
        <Button icon={"new-object"} onClick={createNote}></Button>
      </Tooltip>
    </div>
  );
};
