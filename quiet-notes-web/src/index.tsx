import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "normalize.css";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { Admin } from "./admin/admin";
import { AppHeader } from "./app/app-header";
import { globalHistory } from "./app/app-history";
import { Application } from "./app/application";
import { AdminRoute, AuthorRoute, LoginPage, PrivateRoute } from "./auth/auth";
import { HeaderLayout } from "./layout/header-layout";
import { Lobby } from "./lobby/lobby";
import { NoteEditor } from "./note/note-editor";
import { Notebook } from "./notebook/notebook";
import { NotesList } from "./notebook/notebook-notes-list";
import {
  NotebookEditorToolbar,
  NotebookSidebarToolbar,
} from "./notebook/notebook-toolbars";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <Application>
    <Router history={globalHistory}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/notebook" />
        </Route>

        <Route exact path="/login" component={LoginPage} />

        <PrivateRoute>
          <HeaderLayout
            header={<AppHeader />}
            body={
              <Switch>
                <Route exact path="/lobby">
                  <Lobby />
                </Route>

                <AuthorRoute path="/notebook/:noteId?">
                  <Notebook
                    sidebarToolbar={<NotebookSidebarToolbar />}
                    sidebar={<NotesList />}
                    editorToolbar={<NotebookEditorToolbar />}
                    editor={<NoteEditor />}
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
    </Router>
  </Application>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
