import firebase from "firebase";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { useCollectionData, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useUserInfo } from "../firebase/firebase";
import { Note } from "./notebook-model";

const noteCollectionRef = firebase.firestore().collection("notes");

export const useNotesCollection = () => {
  const userInfo = useUserInfo();

  const query = noteCollectionRef
    .where("author.uid", "==", userInfo.uid ?? "")
    .orderBy("_updatedAt", "desc");

  return useCollectionData<Note>(query, {
    idField: "id",
    transform: fromReadModel,
  });
};

export const useNoteOnce = (id: string) =>
  useDocumentDataOnce<Note>(noteCollectionRef.doc(id), {
    idField: "id",
    transform: fromReadModel,
  });

export const createNote = async (author: firebase.UserInfo): Promise<string> => {
  const { id, ...note } = authorToWriteModel(author);
  await noteCollectionRef.doc(id).set(note);
  return id;
};

export const useCreateNote = () => {
  const [error, setError] = useState<firebase.FirebaseError | undefined>();
  const [loading, setLoading] = useState(false);

  const createNote = useCallback(
    async (author: firebase.UserInfo): Promise<string | undefined> => {
      const { id, ...note } = authorToWriteModel(author);
      let result: string | undefined;
      setLoading(true);

      try {
        await noteCollectionRef.doc(id).set(note);
        result = id;
      } catch (e) {
        setError(e);
      }

      setLoading(false);
      return result;
    },
    []
  );

  return [createNote, loading, error] as const;
};

export const updateNote = (update: Note) => {
  const { id, ...note } = noteToWriteModel(update);
  return noteCollectionRef.doc(id).set(note, { merge: true });
};

export const deleteNote = (id: string) => noteCollectionRef.doc(id).delete();

interface NoteReadModel {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly _updatedAt?: firebase.firestore.Timestamp;
  readonly _createdAt?: firebase.firestore.Timestamp;
  readonly author: firebase.UserInfo;
}

interface NoteWriteModel {
  id: string;
  title: string;
  content: string;
  _updatedAt: firebase.firestore.FieldValue;
  _createdAt?: firebase.firestore.FieldValue;
  author: firebase.UserInfo;
}

const fromReadModel = (documentData: NoteReadModel): Note => {
  const { _createdAt, _updatedAt, ...note } = documentData;
  return {
    _createdAt: _createdAt?.toDate(),
    _updatedAt: _updatedAt?.toDate(),
    ...note,
  };
};

const authorToWriteModel = (author: firebase.UserInfo): NoteWriteModel => ({
  id: nanoid(),
  title: "",
  content: "",
  author,
  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
});

const noteToWriteModel = ({
  _createdAt,
  _updatedAt,
  ...update
}: Note): NoteWriteModel => ({
  ...update,
  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});
