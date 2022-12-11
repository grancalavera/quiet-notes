import CircularProgress from "@mui/material/CircularProgress";
import { FC } from "react";
import { CenterLayout } from "./center-layout";

export const LoadingLayout: FC = () => (
  <CenterLayout>
    <CircularProgress />
  </CenterLayout>
);
