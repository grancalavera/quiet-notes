import { FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Notebook } from "./notebook/notebook-container";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "./theme/theme";

FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
  <React.StrictMode>
    <Theme>
      <Notebook />
    </Theme>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
