import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "normalize.css";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Admin } from "./admin/admin";
import { AdminRoute, AuthorRoute, LoginPage, PrivateRoute } from "./app/app-auth";
import { AppHeader } from "./app/app-header";
import { Application } from "./app/application";
import { HeaderLayout } from "./layout/header-layout";
import { Lobby } from "./lobby/lobby";
import { NotebookLayout } from "./notebook/notebook-layout";
import { NoteEditorContainer } from "./notebook/notebook-note-editor";
import { NotesList } from "./notebook/notebook-notes-list";
import { NotebookRedirectNewNotes } from "./notebook/notebook-redirect-new-notes";
import { NoteEditorToolbar, SidebarToolbar } from "./notebook/notebook-toolbars";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <Application>
    <BrowserRouter>
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
                      editor={<NoteEditorContainer />}
                    />
                    <NotebookRedirectNewNotes />
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
    </BrowserRouter>
  </Application>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
