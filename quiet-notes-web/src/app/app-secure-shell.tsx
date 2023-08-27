import { Outlet } from "react-router-dom";
import { RequireAuth } from "../auth/auth";
import { PancakeStackLayout } from "../layout/pancake-stack-layout";
import { AppHeader } from "./app-header";

export const AppSecureShell = () => (
  <RequireAuth>
    <PancakeStackLayout header={<AppHeader />} body={<Outlet />} />
  </RequireAuth>
);
