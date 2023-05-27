import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { FC, PropsWithChildren } from "react";

export const FullPageLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  console.log("<FullPageLayout />");
  return <Layout square>{children}</Layout>;
};

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
