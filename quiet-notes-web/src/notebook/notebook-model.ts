import firebase from "firebase/app";

export interface Note {
  title: string;
  content: string;
  author: firebase.UserInfo;
}

export interface WriteNote extends Note {
  createdAt: firebase.firestore.FieldValue;
  modifiedAt: firebase.firestore.FieldValue;
}

export interface ReadNote extends Note {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface RawReadNote extends Note {
  createdAt: firebase.firestore.Timestamp;
  modifiedAt: firebase.firestore.Timestamp;
}

export const createNoteDraft = (author: firebase.UserInfo): Note => ({
  author,
  title: "",
  content: "",
});
