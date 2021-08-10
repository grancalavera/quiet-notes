import create, { State } from "zustand";
import { AppError } from "./app-error";
import firebase from "firebase";

type User = firebase.User;

interface AppState extends State {
  errors: AppError[];
  handleError: (error: AppError) => void;
  dismissError: () => void;

  getUser: () => User;
  setUser: (user: User) => void;
  reset: () => void;
}

const throwUserNotSet = (): User => {
  throw new Error("User not set");
};

export const useAppState = create<AppState>((set) => ({
  getUser: throwUserNotSet,
  setUser: (user: User) => set({ getUser: () => user }),
  reset: () => set({ getUser: throwUserNotSet }),

  errors: [],
  handleError: (error) => set(({ errors }) => ({ errors: [...errors, error] })),
  dismissError: () => set(({ errors }) => ({ errors: errors.slice(1) })),
}));

export const useUser = () => useAppState(selectUser);
export const useErrorHandler = () => useAppState(selectHandleError);

const selectUser = (s: AppState) => s.getUser();
const selectHandleError = (s: AppState) => s.handleError;
