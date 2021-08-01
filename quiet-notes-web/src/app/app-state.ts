import { State } from "zustand";
import firebase from "firebase/app";
import create from "zustand/vanilla";

interface AppState extends State {
  getUser: () => firebase.User;
}

export const useAppState = create<AppState>((set, get) => ({
  getUser: () => {
    throw new Error("AppState not initialized");
  },

  initialise: (user: firebase.User) => () => {
    set({ getUser: () => user });
  },
}));
