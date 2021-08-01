import create, { State } from "zustand";
import firebase from "firebase/app";

interface AppState extends State {
  getUser: () => firebase.User;
  setUser: (user: firebase.User) => void;
  unsetUser: () => void;
}

const userNotSet = (): firebase.User => {
  throw new Error("User not set");
};

export const useAppState = create<AppState>((set) => ({
  getUser: userNotSet,

  setUser: (user: firebase.User) => {
    set({ getUser: () => user });
  },

  unsetUser: () => set({ getUser: userNotSet }),
}));
