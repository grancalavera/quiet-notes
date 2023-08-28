import { useEffect } from "react";
import { closeAdditionalNote } from "../notebook/notebook-state";
import { useIsMobile, useIsTablet } from "../platform/devices";

export const NoteSplitAgent = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (isMobile || isTablet) closeAdditionalNote();
  }, [isMobile, isTablet]);

  return null;
};
