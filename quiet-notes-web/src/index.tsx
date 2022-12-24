import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "normalize.css";
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Application } from "./app/application";
import { LoginPage, RequireAuth, RequireRole } from "./auth/auth";
import { Loading } from "./components/loading";
import { Lobby } from "./lobby/lobby";
import reportWebVitals from "./reportWebVitals";

const AppShell = lazy(() => import("./routes/AppShell"));
const Notebook = lazy(() => import("./routes/Notebook"));
const Admin = lazy(() => import("./routes/Admin"));
const NoteEditor = lazy(() => import("./routes/NoteEditor"));

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
              <Suspense fallback={<Loading />}>
                <AppShell />
              </Suspense>
            </RequireAuth>
          }
        >
          <Route path="lobby" element={<Lobby />} />

          <Route
            path="notebook/*"
            element={
              <RequireRole role="author" fallback="/lobby">
                <Suspense fallback={<Loading />}>
                  <Notebook />
                </Suspense>
              </RequireRole>
            }
          >
            <Route
              path=":noteId"
              element={
                <Suspense fallback={<Loading />}>
                  <NoteEditor />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="admin"
            element={
              <RequireRole role="admin" fallback="/">
                <Suspense fallback={<Loading />}>
                  <Admin />
                </Suspense>
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
