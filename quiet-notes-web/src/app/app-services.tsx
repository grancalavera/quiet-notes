import { FC } from "react";
import { firebase$ } from "../firebase/firebase-initialize";
import { bind } from "@react-rxjs/core";

export const [useFirebase] = bind(firebase$);

export const Services: FC = ({ children }) => {
  useFirebase();
  return <>{children}</>;
};
