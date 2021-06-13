import { setup, Block } from "bem-cn";
import { useRef } from "react";

export const block = setup({
  ns: "quiet-notes-",
  el: "__",
  mod: "--",
  modValue: "-",
});

export const useBlock = (name: string) => useRef<Block>(block(name)).current;
