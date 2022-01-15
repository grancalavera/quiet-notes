import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, useMemo } from "react";
import { useAppTheme } from "./use-app-theme";

export const AppTheme: FC = ({ children }) => {
  const mode = useAppTheme();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
