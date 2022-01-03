import { Observable } from "rxjs";
import { Note, NoteId } from "../notebook/notebook-model";

export interface NotebookServiceSchema {
  createNote: () => Observable<NoteId>;
  getNotesCollection: () => Observable<Note[]>;
  getNoteById: (id: NoteId) => Observable<Note | undefined>;
  updateNote: (note: Note) => Observable<void>;
  deleteNote: (id: NoteId) => Observable<void>;
}
