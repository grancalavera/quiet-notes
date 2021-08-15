import { AppLayout } from "../layout/app-layout";
import { Header } from "./notebook-header";
import { NoteEditorContainer } from "./notebook-note-editor";
import { NotesList } from "./notebook-note-list";
import { EditorToolbar, SidebarToolbar } from "./notebook-toolbars";

export const Notebook = () => {
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
