import { FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { App } from "./app/app";
import { LoginPage, PrivateRoute } from "./app/app-auth";
import { AppErrorBoundary } from "./app/app-error-boundary";
import "./index.scss";
import { Notebook } from "./notebook/notebook-container";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "./theme/theme";

FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App>
        <Theme>
          <BrowserRouter>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <PrivateRoute path="/notebook">
                <Notebook />
              </PrivateRoute>
              <Redirect to="/notebook" />
            </Switch>
          </BrowserRouter>
        </Theme>
      </App>
    </AppErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
