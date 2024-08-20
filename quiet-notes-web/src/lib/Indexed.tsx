import { PropsWithChildren } from "react";
import { RelatedContext } from "./relation";

export const Indexed = ({
  children,
  index,
}: PropsWithChildren & { index: string }) => (
  <RelatedContext.Provider value={index}>{children}</RelatedContext.Provider>
);
