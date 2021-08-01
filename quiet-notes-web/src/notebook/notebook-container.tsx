import { useEffect } from "react";
import { AppLayout } from "../layout/app-layout";
import { Header } from "./notebook-header";
import { useNotebookState } from "./notebook-local-state";
import { NoteEditorContainer } from "./notebook-note-editor";
import { NotesList } from "./notebook-note-list";
import { EditorToolbar, SidebarToolbar } from "./notebook-toolbars";

export const Notebook = () => {
  const closeNote = useNotebookState((s) => s.closeNote);

  useEffect(() => () => closeNote(), [closeNote]);

  return (
    <AppLayout
      header={<Header />}
      sidebarToolbar={<SidebarToolbar />}
      sidebar={<NotesList />}
      editorToolbar={<EditorToolbar />}
      editor={<NoteEditorContainer />}
    />
  );
};
