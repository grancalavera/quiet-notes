import firebase from "firebase/app";

export interface Note {
  id: string;
  title: string;
  content: string;
  author: firebase.UserInfo;
}
