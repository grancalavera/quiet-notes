import { FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app/app";
import { Header } from "./header/header";
import "./index.scss";
import { AppLayout } from "./layout/app-layout";
import reportWebVitals from "./reportWebVitals";

FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
  <React.StrictMode>
    <AppLayout header={<Header />}>
      <App />
    </AppLayout>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
