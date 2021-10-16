import { FocusStyleManager } from "@blueprintjs/core";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Admin } from "./admin/admin";
import { App } from "./app/app";
import { AdminRoute, AuthorRoute, LoginPage, PrivateRoute } from "./app/app-auth";
import { AppErrorBoundary } from "./app/app-error-boundary";
import { AppHeader } from "./app/app-header";
import { AppLayout } from "./app/app-layout";
import "./index.scss";
import { Lobby } from "./lobby/lobby";
import { NotebookLayout } from "./notebook/notebook-layout";
import { NoteEditorContainer } from "./notebook/notebook-note-editor";
import { NotesList } from "./notebook/notebook-notes-list";
import { NoteEditorToolbar, SidebarToolbar } from "./notebook/notebook-toolbars";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "./theme/theme";

FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App>
        <Theme />
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Redirect to="/notebook" />
            </Route>

            <Route exact path="/login" component={LoginPage} />

            <PrivateRoute>
              <AppLayout
                header={<AppHeader />}
                body={
                  <Switch>
                    <Route exact path="/lobby">
                      <Lobby />
                    </Route>

                    <AuthorRoute path="/notebook/:noteId?">
                      <NotebookLayout
                        sidebarToolbar={<SidebarToolbar />}
                        sidebar={<NotesList />}
                        editorToolbar={<NoteEditorToolbar />}
                        editor={<NoteEditorContainer />}
                      />
                    </AuthorRoute>

                    <AdminRoute path="/admin">
                      <Admin />
                    </AdminRoute>

                    <Route>
                      <Redirect to="/" />
                    </Route>
                  </Switch>
                }
              />
            </PrivateRoute>
          </Switch>
        </BrowserRouter>
      </App>
    </AppErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
