import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { block } from "../app/bem";
import { useCreateNote, useNotebookState } from "./notebook-local-state";
import { deleteNote } from "./notebook-server-state";
import "./notebook-toolbars.scss";

const b = block("toolbar");

export const EditorToolbar = () => {
  const selectedNote = useNotebookState((s) => s.selectedNote);

  return (
    <div className={b()}>
      {!!selectedNote && (
        <ButtonGroup>
          <Button icon="trash" onClick={() => deleteNote(selectedNote)} />
          <Button icon="floppy-disk" />
        </ButtonGroup>
      )}
    </div>
  );
};

export const SidebarToolbar = () => {
  const createNote = useCreateNote();
  return (
    <div className={b()}>
      <Tooltip content="create note">
        <Button icon={"new-object"} minimal onClick={createNote}></Button>
      </Tooltip>
    </div>
  );
};
