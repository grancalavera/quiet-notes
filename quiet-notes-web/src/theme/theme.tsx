import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, useMemo } from "react";
import { useQNTheme } from "./use-theme";

export const Theme: FC = ({ children }) => {
  const mode = useQNTheme();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
