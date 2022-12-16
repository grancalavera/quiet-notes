import { Outlet } from "react-router-dom";
import { AppHeader } from "../app/app-header";
import { PancakeStackLayout } from "../layout/pancake-stack-layout";

export default () => (
  <PancakeStackLayout header={<AppHeader />} body={<Outlet />} />
);
