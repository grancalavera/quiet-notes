import { FC } from "react";
import { useFirebase } from "../firebase/firebase-initialize";

export const Services: FC = ({ children }) => {
  useFirebase();
  return <>{children}</>;
};
