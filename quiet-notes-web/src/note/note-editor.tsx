import { useSelectedNoteId } from "../notebook/notebook-state";

export const NoteEditor = () => {
  const noteId = useSelectedNoteId();
  return <pre>{JSON.stringify({ noteId }, null, 2)}</pre>;
};
