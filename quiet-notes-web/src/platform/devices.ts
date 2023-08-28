import { Theme, useMediaQuery } from "@mui/material";

// Default breakpoints
// Each breakpoint (a key) matches with a fixed screen width (a value):
// xs, extra-small: 0px
// sm, small: 600px
// md, medium: 900px
// lg, large: 1200px
// xl, extra-large: 1536px

export const mobile = (theme: Theme) => theme.breakpoints.down("sm");
export const tablet = (theme: Theme) => theme.breakpoints.down("md");
export const desktop = (theme: Theme) => theme.breakpoints.up("md");

export const useIsMobile = () => useMediaQuery(mobile);
export const useIsTablet = () => useMediaQuery(tablet);
export const useIsDesktop = () => useMediaQuery(desktop);
