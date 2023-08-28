import { PaletteMode, Theme, responsiveFontSizes } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { useSettings } from "../settings/settings-state";

const createResponsiveTheme = (mode: PaletteMode): Theme => {
  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return responsiveFontSizes(theme, {
    factor: 2.5,
  });
};

const theme: Record<PaletteMode, Theme> = {
  dark: createResponsiveTheme("dark"),
  light: createResponsiveTheme("light"),
};

export const AppTheme = ({ children }: PropsWithChildren) => {
  const mode = useSettings().theme;
  return (
    <ThemeProvider theme={theme[mode]}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
