import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { ReactNode, VFC } from "react";

interface HeaderLayoutProps {
  header?: ReactNode;
  body?: ReactNode;
}

export const HeaderLayout: VFC<HeaderLayoutProps> = (props) => {
  return (
    <Layout>
      <Box sx={{ gridArea: "header" }}>{props.header}</Box>
      <Box sx={{ gridArea: "body", overflowY: "auto", overflowX: "hidden" }}>
        {props.body}
      </Box>
    </Layout>
  );
};

const Layout = styled("div")`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;

  grid-template-areas:
    "header"
    "body";
`;
