import firebase from "firebase/app";

export interface Note {
  id: string;
  title: string;
  content: string;
  author: firebase.UserInfo;
  _createdAt?: Date;
  _updatedAt?: Date;
}

export const isNote = (candidate: unknown): candidate is Note => {
  if (typeof candidate !== "object" || candidate === null) {
    return false;
  } else {
    return Object.keys(candidate).every((key) => {
      return ["id", "title", "content", "author", "_createdAt", "_updatedAt"].includes(
        key
      );
    });
  }
};
