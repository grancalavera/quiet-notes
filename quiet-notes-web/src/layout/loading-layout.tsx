import CircularProgress from "@mui/material/CircularProgress";
import { VFC } from "react";
import { CenterLayout } from "./center-layout";

export const LoadingLayout: VFC = () => (
  <CenterLayout>
    <CircularProgress />
  </CenterLayout>
);
