import { useEffect, VFC } from "react";
import { useTheme } from "./use-theme";

export const Theme: VFC = () => {
  const theme = useTheme((s) => s.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("bp3-dark");
    } else {
      document.body.classList.remove("bp3-dark");
    }
  }, [theme]);

  return null;
};
