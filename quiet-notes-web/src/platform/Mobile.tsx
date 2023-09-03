import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppSecureShell } from "../app/app-secure-shell";
import { RequireRole } from "../auth/auth";
import { Loading } from "../components/loading";

const Lobby = lazy(() => import("../routes/Lobby"));
const Notebook = lazy(() => import("../routes/NotebookMobile"));

export default () => (
  <Routes>
    <Route path="*" element={<AppSecureShell />}>
      <Route
        path="lobby"
        element={
          <Suspense fallback={<Loading />}>
            <Lobby />
          </Suspense>
        }
      />
      <Route
        path="notebook"
        element={
          <RequireRole role="author" fallback="/lobby">
            <Suspense fallback={<Loading />}>
              <Notebook />
            </Suspense>
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/notebook" />} />
    </Route>
  </Routes>
);
