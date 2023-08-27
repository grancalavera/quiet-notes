import { useMediaQuery } from "@mui/material";
import { Suspense, lazy } from "react";
import { Loading } from "../components/loading";

const Desktop = lazy(() => import("./Desktop"));
const Mobile = lazy(() => import("./Mobile"));

export const TargetPlatform = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <Suspense fallback={<Loading />}>
      {isMobile ? <Mobile /> : <Desktop />}
    </Suspense>
  );
};
