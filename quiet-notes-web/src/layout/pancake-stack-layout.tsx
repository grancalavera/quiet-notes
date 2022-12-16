import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { FC, ReactNode } from "react";

interface PancakeStackLayoutProps {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export const PancakeStackLayout: FC<PancakeStackLayoutProps> = (props) => {
  return (
    <Layout>
      <Box sx={{ gridArea: "header", overflow: "hidden" }}>{props.header}</Box>
      <Box sx={{ gridArea: "body", overflow: "hidden" }}>{props.body}</Box>
      <Box sx={{ gridArea: "footer", overflow: "hidden" }}>{props.footer}</Box>
    </Layout>
  );
};

const Layout = styled("div")`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  grid-template-areas:
    "header"
    "body"
    "footer";
`;
