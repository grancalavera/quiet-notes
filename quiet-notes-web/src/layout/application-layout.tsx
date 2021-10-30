import { css } from "@emotion/react";
import { Paper } from "@mui/material";
import { FC } from "react";

export const ApplicationLayout: FC = ({ children }) => (
  <Paper
    square
    css={css`
      box-sizing: border-box;
      overflow: hidden;
      height: 100vh;
      width: 100vw;

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
    `}
  >
    {children}
  </Paper>
);
