import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, PropsWithChildren, useMemo } from "react";
import { useAppTheme } from "./app-theme-state";

export const AppTheme: FC<PropsWithChildren<{}>> = ({ children }) => {
  const mode = useAppTheme();

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
