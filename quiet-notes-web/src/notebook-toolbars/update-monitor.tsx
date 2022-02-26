import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { VFC } from "react";
import { isLoading } from "../lib/load-result";
import { useUpdateNoteResult } from "../note/note-state";

export const UpdateMonitor: VFC = () => {
  const result = useUpdateNoteResult();

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        display: "grid",
        placeItems: "center",
      }}
    >
      {isLoading(result) && <CircularProgress size={20} />}
    </Box>
  );
};