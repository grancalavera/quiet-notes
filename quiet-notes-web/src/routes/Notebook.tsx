import { NotebookListToolbar } from "../toolbars/notebook-list-toolbar";
import { Notebook } from "../notebook/notebook";
import { NotesList } from "../notebook/notebook-notes-list";
import NoteEditor from "./NoteEditor";

export default () => (
  <Notebook
    sidebarToolbar={<NotebookListToolbar />}
    sidebar={<NotesList />}
    editor={<NoteEditor />}
  />
);
