import { Observable } from "rxjs";
import { Note, NoteId } from "../notebook/notebook-model";

export interface NotebookServiceSchema {
  getNotesCollection: () => Observable<Note[]>;
  getNoteById: (id: NoteId) => Observable<Note>;

  createNote: () => Promise<NoteId>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: NoteId) => Promise<void>;
}
