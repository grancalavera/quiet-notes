import { NotebookSidebarToolbar } from "../toolbars/notebook-sidebar-toolbar";
import { Notebook } from "../notebook/notebook";
import { NotesList } from "../notebook/notebook-notes-list";
import NoteEditor from "./NoteEditor";

export default () => (
  <Notebook
    sidebarToolbar={<NotebookSidebarToolbar />}
    sidebar={<NotesList />}
    editor={<NoteEditor />}
  />
);
