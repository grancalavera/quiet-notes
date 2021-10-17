import { ButtonGroup } from "@mui/material";
import { block } from "../app/bem";
import { CreateNoteButton } from "../components/CreateNoteButton";
import { DeleteNoteButton } from "../components/DeleteNoteButton";
import { useSelectedNoteId } from "./notebook-state";
import "./notebook-toolbars.scss";
import { SortMenu } from "./SortNotesMenu";

const b = block("note-editor-toolbar");

export const NoteEditorToolbar = () => {
  const selectedNoteId = useSelectedNoteId();
  return (
    <div className={b()}>
      <ButtonGroup>
        {selectedNoteId && <DeleteNoteButton noteId={selectedNoteId} isSelected={true} />}
        <CreateNoteButton />
      </ButtonGroup>
    </div>
  );
};

export const SidebarToolbar = () => (
  <div className={b()}>
    <SortMenu />
  </div>
);
