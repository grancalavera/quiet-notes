import firebase from "firebase/app";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Note } from "./notebook-model";

export const useNotesCollection = (userInfo: firebase.UserInfo | null | undefined) => {
  const notesRef = firebase
    .firestore()
    .collection("notes")
    .where("uid", "==", userInfo?.uid ?? "");
  const query = notesRef.limit(25);

  return useCollectionData<Note>(query, { idField: "id" });
};
