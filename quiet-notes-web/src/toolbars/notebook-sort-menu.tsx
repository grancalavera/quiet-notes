import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { NotebookSortType } from "../notebook/notebook-model";
import {
  changeSortType,
  useSortType,
} from "../notebook/notes-collection-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const NotebookSortMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const sortType = useSortType();

  const handleSort = (s: NotebookSortType) => {
    setAnchorEl(null);
    changeSortType(s);
  };

  return (
    <>
      <NotebookToolbarButton
        title="sort"
        onMouseDown={(e) => setAnchorEl(e.currentTarget)}
        kind="sort"
      />
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => handleSort("ByDateDesc")}
          selected={sortType === "ByDateDesc"}
        >
          by created date (newest first)
        </MenuItem>
        <MenuItem
          onClick={() => handleSort("ByDateAsc")}
          selected={sortType === "ByDateAsc"}
        >
          by created date (oldest first)
        </MenuItem>
        <MenuItem
          onClick={() => handleSort("ByTitleAsc")}
          selected={sortType === "ByTitleAsc"}
        >
          by title (ABC...)
        </MenuItem>
        <MenuItem
          onClick={() => handleSort("ByTitleDesc")}
          selected={sortType === "ByTitleDesc"}
        >
          by title (ZYX...)
        </MenuItem>
      </Menu>
    </>
  );
};
