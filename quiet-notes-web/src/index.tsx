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
import { history } from "./app/app-history";
import { Application } from "./app/application";
import { AdminRoute, AuthorRoute, LoginPage, PrivateRoute } from "./auth/auth";
import { HeaderLayout } from "./layout/header-layout";
import { Lobby } from "./lobby/lobby";
import { CreatedNoteHandler } from "./notebook/notebook-create-note-handlers";
import { NotebookLayout } from "./notebook/notebook-layout";
import { NoteEditor } from "./notebook/notebook-note-editor";
import { NotesList } from "./notebook/notebook-notes-list";
import { NoteEditorToolbar, SidebarToolbar } from "./notebook/notebook-toolbars";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <Application>
    <Router history={history}>
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
                  <>
                    <NotebookLayout
                      sidebarToolbar={<SidebarToolbar />}
                      sidebar={<NotesList />}
                      editorToolbar={<NoteEditorToolbar />}
                      editor={<NoteEditor />}
                    />
                    <CreatedNoteHandler />
                  </>
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
