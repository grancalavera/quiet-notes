import SortIcon from "@mui/icons-material/Sort";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useState, VFC } from "react";
import { NotebookSortType, changeSortType, useSortType } from "./notebook-state";

export const SortMenu: VFC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const sortType = useSortType();

  const handleSort = useCallback(
    (s: NotebookSortType) => {
      setAnchorEl(null);
      changeSortType(s);
    },
    [changeSortType]
  );

  return (
    <>
      <Tooltip title="sort">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <SortIcon color="primary" />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
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
