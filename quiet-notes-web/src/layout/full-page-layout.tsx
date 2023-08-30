import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { PropsWithChildren } from "react";

export const FullPageLayout = ({ children }: PropsWithChildren) => (
  <Layout square>{children}</Layout>
);

const Layout = styled(Paper)`
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
