import { VFC } from "react";
import { Redirect } from "react-router-dom";
import { useCreatedNoteId } from "./notebook-state";

export const CreatedNoteHandler: VFC = () => {
  const noteId = useCreatedNoteId();
  return noteId ? <Redirect to={`/notebook/${noteId}`} /> : <></>;
};
