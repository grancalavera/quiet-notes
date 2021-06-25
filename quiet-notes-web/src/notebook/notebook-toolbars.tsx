import { Button } from "@blueprintjs/core";
import { block } from "../app/bem";
import "./notebook-toolbars.scss";
import { useCreateNote } from "./notebook-server-state";

const b = block("toolbar");

export const EditorToolbar = () => {
  const [createNote, isLoading] = useCreateNote();

  return (
    <div className={b({}).mix(b("editor"))}>
      <Button icon="new-object" minimal onClick={createNote} loading={isLoading} />
    </div>
  );
};
