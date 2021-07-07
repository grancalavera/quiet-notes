import { Button } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { signIn, useAuthState } from "../firebase/firebase";
import { AppLayout } from "../layout/app-layout";
import { CenterLayout } from "../layout/center-layout";
import { Header } from "./notebook-header";
import { useNotebookState } from "./notebook-local-state";
import { NoteEditorContainer } from "./notebook-note-editor";
import { NotesList } from "./notebook-note-list";
import { EditorToolbar } from "./notebook-toolbars";

export const Notebook = () => {
  const [user] = useAuthState();
  const resetNotebook = useNotebookState((s) => s.reset);

  useEffect(() => {
    !user && resetNotebook();
  }, [user, resetNotebook]);

  return user ? (
    <AppLayout
      header={<Header />}
      sidebar={<NotesList />}
      editorToolbar={<EditorToolbar />}
      editor={<NoteEditorContainer />}
    />
  ) : (
    <CenterLayout>
      <Button large onClick={signIn}>
        Sign In with Google
      </Button>
    </CenterLayout>
  );
};
