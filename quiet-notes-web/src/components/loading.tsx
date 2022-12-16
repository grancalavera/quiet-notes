import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { FC } from "react";
import { CenterLayout } from "../layout/center-layout";

export const Loading: FC<CircularProgressProps> = (props) => (
  <CenterLayout>
    <CircularProgress {...props} />
  </CenterLayout>
);
