import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { FC } from "react";

const StyledPaper = styled(Paper)`
  box-sizing: border-box;
  overflow: hidden;
  height: 100vh;
  width: 100vw;

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
`;

export const ApplicationLayout: FC = ({ children }) => (
  <StyledPaper square>{children}</StyledPaper>
);
