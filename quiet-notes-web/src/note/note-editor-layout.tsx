import { Box, Stack } from "@mui/material";

interface NoteEditorLayoutProps {
  toolbar?: React.ReactNode;
  editor?: React.ReactNode;
  onFocus?: () => void;
  selected?: boolean;
}

export const NoteEditorLayout = ({
  editor,
  toolbar,
  onFocus,
  selected,
}: NoteEditorLayoutProps) => (
  <Stack
    className="qn-editor-layout"
    gap={1}
    flexGrow={1}
    flexShrink={0}
    flexBasis={"50%"}
    overflow={"hidden"}
    onFocus={onFocus}
    tabIndex={0}
    sx={{
      border: (theme) => {
        const color = selected ? theme.palette.primary.main : "#00000000";
        return `1px solid ${color}`;
      },
    }}
  >
    <Box className="qn-main-editor-toolbar">{toolbar}</Box>
    <Box sx={{ flex: 1 }}>{editor}</Box>
  </Stack>
);
