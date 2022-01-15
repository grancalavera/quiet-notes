import { Observable } from "rxjs";
import { Note, NoteId } from "../notebook/notebook-model";

export interface NotebookServiceSchema {
  getNotesCollection: () => Observable<Note[]>;
  getNoteById: (id: NoteId) => Observable<Note>;

  createNote: () => Observable<NoteId>;
  updateNote: (note: Note) => Observable<void>;
  deleteNote: (id: NoteId) => Observable<void>;
}
