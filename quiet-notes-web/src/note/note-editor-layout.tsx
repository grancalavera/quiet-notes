import { Box, Stack } from "@mui/material";

interface NoteEditorLayoutProps {
  toolbar?: React.ReactNode;
  editor?: React.ReactNode;
}

export const NoteEditorLayout = ({
  editor,
  toolbar,
}: NoteEditorLayoutProps) => (
  <Stack flexGrow={1} gap={1}>
    <Box sx={{ overflow: "hidden" }}>{toolbar}</Box>
    <Box sx={{ flex: 1, overflow: "hidden" }}>{editor}</Box>
  </Stack>
);
