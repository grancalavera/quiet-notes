import { Subscribe } from "@react-rxjs/core";
import { FC, PropsWithChildren } from "react";
import { Loading } from "../components/loading";
import { FullPageLayout } from "../layout/full-page-layout";
import { settings$ } from "../settings/settings-state";
import { AppErrorBoundary } from "./app-error-boundary";
import { AppTheme } from "./app-theme";
import { ReloadPrompt } from "./reload-prompt";

export const Application: FC<PropsWithChildren<{}>> = ({ children }) => (
  <Subscribe source$={settings$}>
    <AppTheme>
      <FullPageLayout>
        <AppErrorBoundary>
          <Subscribe fallback={<Loading />}>{children}</Subscribe>
        </AppErrorBoundary>
      </FullPageLayout>
      <ReloadPrompt />
    </AppTheme>
  </Subscribe>
);
