import { Observable } from "rxjs";
import { Note, NoteId } from "./notebook-model";

export interface NotebookServiceSchema {
  getNotesCollection: () => Observable<Note[]>;
  getNoteById: (id: NoteId) => Observable<Note>;

  createNote: (content?: string) => Promise<NoteId>;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (id: NoteId) => Promise<void>;
}
