import { FC, StrictMode } from "react";
import { FullPageLayout } from "../layout/full-page-layout";
import { AppErrorBoundary } from "./app-error-boundary";
import { AppServices } from "./app-services";
import { AppTheme } from "./app-theme";

export const Application: FC = ({ children }) => {
  return (
    <StrictMode>
      <AppTheme>
        <FullPageLayout>
          <AppErrorBoundary>
            <AppServices>{children}</AppServices>
          </AppErrorBoundary>
        </FullPageLayout>
      </AppTheme>
    </StrictMode>
  );
};
