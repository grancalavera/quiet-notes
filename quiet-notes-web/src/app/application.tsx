import { Subscribe } from "@react-rxjs/core";
import { FC, StrictMode } from "react";
import { CenterLayout } from "../layout/center-layout";
import { FullPageLayout } from "../layout/full-page-layout";
import { AppErrorBoundary } from "./app-error-boundary";
import { Services } from "./app-services";
import { AppTheme } from "./app-theme";
import CircularProgress from "@mui/material/CircularProgress";

export const Application: FC = ({ children }) => {
  return (
    <StrictMode>
      <AppTheme>
        <FullPageLayout>
          <AppErrorBoundary>
            <Subscribe
              fallback={
                <CenterLayout>
                  <CircularProgress size={50} />
                </CenterLayout>
              }
            >
              <Services>{children}</Services>
            </Subscribe>
          </AppErrorBoundary>
        </FullPageLayout>
      </AppTheme>
    </StrictMode>
  );
};
