import { PropsWithChildren } from "react";
import { useInitializeFirebase } from "../firebase/firebase-initialize";

export const AppServices = ({ children }: PropsWithChildren<{}>) => {
  return <>{useInitializeFirebase() && children}</>;
};
