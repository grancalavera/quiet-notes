import { Subscribe } from "@react-rxjs/core";
import { FC, StrictMode } from "react";
import { FullPageLayout } from "../layout/full-page-layout";
import { LoadingLayout } from "../layout/loading-layout";
import { AppErrorBoundary } from "./app-error-boundary";
import { AppTheme } from "./app-theme";

export const Application: FC = ({ children }) => {
  return (
    <StrictMode>
      <AppTheme>
        <FullPageLayout>
          <AppErrorBoundary>
            <Subscribe fallback={<LoadingLayout />}>{children}</Subscribe>
          </AppErrorBoundary>
        </FullPageLayout>
      </AppTheme>
    </StrictMode>
  );
};
