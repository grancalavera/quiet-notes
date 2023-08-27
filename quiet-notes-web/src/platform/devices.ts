import { useMediaQuery } from "@mui/material";

export const useIsMobile = () => useMediaQuery("(max-width: 600px)");
export const useIsSmallDesktop = () => useMediaQuery("(max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");