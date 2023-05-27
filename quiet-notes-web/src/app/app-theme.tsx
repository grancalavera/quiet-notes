import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, PropsWithChildren, useMemo } from "react";
import { useSettings } from "../settings/settings-state";

export const AppTheme: FC<PropsWithChildren<{}>> = ({ children }) => {
  const mode = useSettings().theme;
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  console.log("<AppTheme />");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
