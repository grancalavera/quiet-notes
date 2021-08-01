import create, { State } from "zustand";
import firebase from "firebase/app";

interface AppState extends State {
  getUser: () => firebase.User;
  setUser: (user: firebase.User) => void;
  reset: () => void;
}

const throwUserNotSet = (): firebase.User => {
  throw new Error("User not set");
};

export const useAppState = create<AppState>((set) => ({
  getUser: throwUserNotSet,

  setUser: (user: firebase.User) => {
    set({ getUser: () => user });
  },

  reset: () => set({ getUser: throwUserNotSet }),
}));

export const useUser = () => useAppState((s) => s.getUser());
