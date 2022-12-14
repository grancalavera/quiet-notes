import { Outlet } from "react-router-dom";
import { NotebookEditorToolbar } from "../notebook-toolbars/notebook-editor-toolbar";
import { NotebookSidebarToolbar } from "../notebook-toolbars/notebook-sidebar-toolbar";
import { Notebook } from "../notebook/notebook";
import { NotesList } from "../notebook/notebook-notes-list";

export default () => (
  <Notebook
    sidebarToolbar={<NotebookSidebarToolbar />}
    sidebar={<NotesList />}
    editorToolbar={<NotebookEditorToolbar />}
    editor={<Outlet />}
  />
);
