import { PropsWithChildren, useId } from "react";
import { RelatedContext } from "./relation";

export const Local = ({ children }: PropsWithChildren) => (
  <RelatedContext.Provider value={useId()}>{children}</RelatedContext.Provider>
);
