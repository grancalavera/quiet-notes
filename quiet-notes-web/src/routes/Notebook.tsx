import { Outlet } from "react-router-dom";
import { withSubscribe } from "../lib/with-subscribe";
import { SidebarNoteEditor } from "../note/note-editor";
import { CloseSidebarButton } from "../notebook-toolbars/close-sidebar-button";
import { NotebookEditorToolbar } from "../notebook-toolbars/notebook-editor-toolbar";
import { NotebookSidebarToolbar } from "../notebook-toolbars/notebook-sidebar-toolbar";
import { Notebook } from "../notebook/notebook";
import { NotesList } from "../notebook/notebook-notes-list";
import { useSidebarNote } from "../notebook/notebook-state";

export default withSubscribe(() => {
  const sidebarNoteId = useSidebarNote();

  return (
    <Notebook
      sidebarToolbar={<NotebookSidebarToolbar />}
      sidebar={<NotesList />}
      editorToolbar={<NotebookEditorToolbar />}
      editor={<Outlet />}
      editorSidebar={sidebarNoteId ? <SidebarNoteEditor /> : null}
    />
  );
});
