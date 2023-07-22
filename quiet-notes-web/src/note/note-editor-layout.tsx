import { Box, Stack } from "@mui/material";

interface NoteEditorLayoutProps {
  toolbar?: React.ReactNode;
  editor?: React.ReactNode;
}

export const NoteEditorLayout = ({
  editor,
  toolbar,
}: NoteEditorLayoutProps) => (
  <Stack
    className="qn-main-editor-layout"
    gap={1}
    flexGrow={1}
    flexShrink={0}
    flexBasis={"50%"}
    overflow={"hidden"}
  >
    <Box className="qn-main-editor-toolbar">{toolbar}</Box>
    <Box sx={{ flex: 1 }}>{editor}</Box>
  </Stack>
);
