import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SaveIcon from "@mui/icons-material/Save";
import { Box, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ReactNode, VFC } from "react";

interface NotebookToolbarButtonProps {
  loading: boolean;
  onClick: () => void;
  title: string;
  kind: "save" | "delete" | "create";
}

const iconByKind: Record<NotebookToolbarButtonProps["kind"], ReactNode> = {
  create: <NoteAddIcon />,
  delete: <DeleteIcon />,
  save: <SaveIcon />,
};

export const NotebookToolbarButton: VFC<NotebookToolbarButtonProps> = ({
  loading,
  onClick,
  title,
  kind,
}) => {
  return loading ? (
    <Box
      sx={{
        width: 40,
        height: 40,
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress size={30} />
    </Box>
  ) : (
    <Tooltip title={title}>
      <IconButton onClick={onClick} color="primary">
        {iconByKind[kind]}
      </IconButton>
    </Tooltip>
  );
};
