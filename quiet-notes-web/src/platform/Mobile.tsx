import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppSecureShell } from "../app/app-secure-shell";
import { RequireRole } from "../auth/auth";
import { Loading } from "../components/loading";

const Lobby = lazy(() => import("../routes/Lobby"));

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
            <>Mobile Notebook</>
          </RequireRole>
        }
      />
      <Route
        path="admin"
        element={
          <RequireRole role="admin" fallback="/">
            <>Mobile Admin</>
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/notebook" />} />
    </Route>
  </Routes>
);
