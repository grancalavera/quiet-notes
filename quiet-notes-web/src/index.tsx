import { FocusStyleManager } from "@blueprintjs/core";
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
import { NotebookLayout } from "./notebook/notebook-layout";
import { NoteEditorContainer } from "./notebook/notebook-note-editor";
import { NotesList } from "./notebook/notebook-note-list";
import { EditorToolbar, SidebarToolbar } from "./notebook/notebook-toolbars";
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
                        <p>Waiting area</p>
                      </Route>

                      <AuthorRoute path="/notebook">
                        <NotebookLayout
                          sidebarToolbar={<SidebarToolbar />}
                          sidebar={<NotesList />}
                          editorToolbar={<EditorToolbar />}
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
