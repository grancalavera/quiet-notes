import { Button, ButtonGroup, Menu, MenuItem, Popover, Tooltip } from "@blueprintjs/core";
import { useEffect } from "react";
import { useUser } from "../app/app-state";
import { block } from "../app/bem";
import { useCreateNote, useDeleteNote } from "../notebook-service/notebook-service";
import {
  useChangeSortType,
  useDeselectNote,
  useSelectedNoteId,
  useSelectNote,
  useSortType,
} from "./notebook-state";
import "./notebook-toolbars.scss";

const b = block("note-editor-toolbar");

export const NoteEditorToolbar = () => {
  const selectedNoteId = useSelectedNoteId();

  return (
    <div className={b()}>
      {!!selectedNoteId && <DeleteNoteButton noteId={selectedNoteId} deselect />}
    </div>
  );
};

export const DeleteNoteButton = (props: {
  noteId: string;
  className?: string;
  minimal?: boolean;
  deselect: boolean;
}) => {
  const { mutate: deleteNote } = useDeleteNote();
  const deselectNote = useDeselectNote();

  return (
    <Tooltip content="delete note">
      <Button
        minimal={props.minimal}
        className={props.className?.toString()}
        icon="trash"
        onClick={(e) => {
          e.stopPropagation();
          deleteNote(props.noteId);
          props.deselect && deselectNote();
        }}
      />
    </Tooltip>
  );
};

export const SidebarToolbar = () => {
  const user = useUser();
  const { mutate: createNote, data } = useCreateNote();
  const selectNote = useSelectNote();

  useEffect(() => {
    data && selectNote(data);
  }, [data, selectNote]);

  return (
    <div className={b()}>
      <ButtonGroup>
        <SortMenu />
        <Tooltip content="create note">
          <Button icon={"new-object"} onClick={() => createNote(user.uid)} />
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

const SortMenu = () => {
  const sortType = useSortType();
  const changeSortType = useChangeSortType();

  return (
    <Popover
      content={
        <Menu>
          <MenuItem
            active={sortType === "ByDateDesc"}
            text="by created date (new first)"
            icon="sort-desc"
            onClick={() => changeSortType("ByDateDesc")}
          />
          <MenuItem
            active={sortType === "ByDateAsc"}
            text="by created date (old first)"
            icon="sort-asc"
            onClick={() => changeSortType("ByDateAsc")}
          />
          <MenuItem
            active={sortType === "ByTitleAsc"}
            text="by title (asc)"
            icon="sort-alphabetical"
            onClick={() => changeSortType("ByTitleAsc")}
          />
          <MenuItem
            active={sortType === "ByTitleDesc"}
            text="by title (desc)"
            icon="sort-alphabetical-desc"
            onClick={() => changeSortType("ByTitleDesc")}
          />
        </Menu>
      }
    >
      <Tooltip content="sort">
        <Button icon={"sort"} />
      </Tooltip>
    </Popover>
  );
};
