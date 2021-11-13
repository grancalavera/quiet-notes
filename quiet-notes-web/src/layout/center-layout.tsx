import Box from "@mui/material/Box";
import { FC } from "react";

export const CenterLayout: FC = ({ children }) => (
  <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>{children}</Box>
);
