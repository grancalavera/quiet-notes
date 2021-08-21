import { Button } from "@blueprintjs/core";
import { FC, useEffect } from "react";
import { useTheme } from "./use-theme";

export const Theme: FC = ({ children }) => {
  const theme = useTheme((s) => s.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("bp3-dark");
    } else {
      document.body.classList.remove("bp3-dark");
    }
  }, [theme]);

  return <>{children}</>;
};

export const ToggleThemeButton = (props: { className?: string }) => {
  const [theme, toggleTheme] = useTheme((s) => [s.theme, s.toggle]);

  return (
    <Button
      icon={theme === "dark" ? "flash" : "moon"}
      className={props.className?.toString()}
      minimal
      onClick={toggleTheme}
    />
  );
};
