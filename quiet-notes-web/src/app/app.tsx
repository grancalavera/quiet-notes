import { PropsWithChildren } from "react";
import { useInitializeFirebase } from "../firebase/firebase-initialize";

export const App = ({ children }: PropsWithChildren<{}>) => {
  return <>{useInitializeFirebase() && children}</>;
};
