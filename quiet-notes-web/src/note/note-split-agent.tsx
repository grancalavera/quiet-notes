import { useEffect } from "react";
import { useCloseAdditionalNote } from "../notebook/notebook-state-v2";
import { useIsMobile, useIsTablet } from "../platform/devices";

export const NoteSplitAgent = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (isMobile || isTablet) useCloseAdditionalNote();
  }, [isMobile, isTablet]);

  return null;
};
