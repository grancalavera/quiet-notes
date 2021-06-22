import React from "react";
import { NotebookLayout } from "../layout/notebook-layout";
import { NoteEditorContainer } from "./notebook-note-editor-container";
import { NotesList } from "./notebook-note-list";

export const NotebookContainer = () => {
  return <NotebookLayout sidebar={<NotesList />} content={<NoteEditorContainer />} />;
};
