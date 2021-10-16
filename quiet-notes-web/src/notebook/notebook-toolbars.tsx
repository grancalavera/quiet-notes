import { block } from "../app/bem";
import { CreateNoteButton } from "../components/CreateNoteButton";
import "./notebook-toolbars.scss";
import { SortMenu } from "./SortNotesMenu";

const b = block("note-editor-toolbar");

export const NoteEditorToolbar = () => (
  <div className={b()}>
    <CreateNoteButton />
  </div>
);

export const SidebarToolbar = () => (
  <div className={b()}>
    <SortMenu />
  </div>
);
