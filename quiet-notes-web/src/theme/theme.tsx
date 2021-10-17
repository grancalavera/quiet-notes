import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC, useEffect, useMemo } from "react";
import { useQNTheme } from "./use-theme";

export const Theme: FC = ({ children }) => {
  const mode = useQNTheme();

  useEffect(() => {
    if (mode === "dark") {
      document.body.classList.add("bp3-dark");
    } else {
      document.body.classList.remove("bp3-dark");
    }
  }, [mode]);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
