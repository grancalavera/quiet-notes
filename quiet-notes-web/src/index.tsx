import "@fontsource/merriweather/900.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "normalize.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./app/application";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Application />
  </StrictMode>
);
