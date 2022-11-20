import Box from "@mui/material/Box";
import { FC, PropsWithChildren } from "react";

export const CenterLayout: FC<PropsWithChildren<{}>> = ({ children }) => (
  <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>{children}</Box>
);
