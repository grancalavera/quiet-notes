import { Subscribe } from "@react-rxjs/core";
import { FC, PropsWithChildren, StrictMode } from "react";
import { Loading } from "../components/loading";
import { FullPageLayout } from "../layout/full-page-layout";
import { AppErrorBoundary } from "./app-error-boundary";
import { AppTheme } from "./app-theme";
import { ReloadPrompt } from "./reload-prompt";

export const Application: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <StrictMode>
      <AppTheme>
        <FullPageLayout>
          <AppErrorBoundary>
            <Subscribe fallback={<Loading />}>{children}</Subscribe>
          </AppErrorBoundary>
        </FullPageLayout>
        <ReloadPrompt />
      </AppTheme>
    </StrictMode>
  );
};
