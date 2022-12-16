import { FC, PropsWithChildren, StrictMode } from "react";
import { FullPageLayout } from "../layout/full-page-layout";
import { AppErrorBoundary } from "./app-error-boundary";
import { AppTheme } from "./app-theme";

export const Application: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <StrictMode>
      <AppTheme>
        <FullPageLayout>
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </FullPageLayout>
      </AppTheme>
    </StrictMode>
  );
};
