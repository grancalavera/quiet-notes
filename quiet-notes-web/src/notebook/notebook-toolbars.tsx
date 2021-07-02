import { Button, Tooltip } from "@blueprintjs/core";
import { block } from "../app/bem";
import { useCreateNote } from "./notebook-local-state";
import "./notebook-toolbars.scss";

const b = block("toolbar");

export const EditorToolbar = () => {
  const createNote = useCreateNote();
  return (
    <div className={b({}).mix(b("editor"))}>
      <Tooltip content="create note">
        <Button icon={"new-object"} minimal onClick={createNote}></Button>
      </Tooltip>
    </div>
  );
};
