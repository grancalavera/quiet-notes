import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "normalize.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Admin } from "./admin/admin";
import { AppHeader } from "./app/app-header";
import { Application } from "./app/application";
import { LoginPage, RequireAuth, RequireRole } from "./auth/auth";
import { HeaderLayout } from "./layout/header-layout";
import { Lobby } from "./lobby/lobby";
import { NoteEditor } from "./note/note-editor";
import { NotebookEditorToolbar } from "./notebook-toolbars/notebook-editor-toolbar";
import { NotebookSidebarToolbar } from "./notebook-toolbars/notebook-sidebar-toolbar";
import { Notebook } from "./notebook/notebook";
import { NotesList } from "./notebook/notebook-notes-list";
import reportWebVitals from "./reportWebVitals";

const root = createRoot(document.getElementById("root")!);

root.render(
  <Application>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/notebook" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <HeaderLayout header={<AppHeader />} body={<Outlet />} />
            </RequireAuth>
          }
        >
          <Route path="lobby" element={<Lobby />} />

          <Route
            path="notebook/*"
            element={
              <RequireRole role="author" fallback="/lobby">
                <Notebook
                  sidebarToolbar={<NotebookSidebarToolbar />}
                  sidebar={<NotesList />}
                  editorToolbar={<NotebookEditorToolbar />}
                  editor={<Outlet />}
                />
              </RequireRole>
            }
          >
            <Route path=":noteId" element={<NoteEditor />} />
          </Route>

          <Route
            path="admin"
            element={
              <RequireRole role="admin" fallback="/">
                <Admin />
              </RequireRole>
            }
          />
        </Route>

        <Route element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </Application>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
