import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EastIcon from "@mui/icons-material/East";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SaveIcon from "@mui/icons-material/Save";
import { Box, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ReactNode } from "react";

interface NotebookToolbarButtonProps {
  loading?: boolean;
  onClick: () => void;
  title: string;
  kind: "save" | "delete" | "create" | "split" | "close" | "duplicate";
  disabled?: boolean;
}

const iconByKind: Record<NotebookToolbarButtonProps["kind"], ReactNode> = {
  create: <NoteAddIcon />,
  delete: <DeleteIcon />,
  save: <SaveIcon />,
  split: <EastIcon />,
  close: <CloseIcon />,
  duplicate: <ContentCopyIcon />,
};

export const NotebookToolbarButton = ({
  loading,
  onClick,
  title,
  kind,
  disabled,
}: NotebookToolbarButtonProps) => {
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
      <IconButton onClick={onClick} color="primary" disabled={disabled}>
        {iconByKind[kind]}
      </IconButton>
    </Tooltip>
  );
};
