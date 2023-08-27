import { Subscribe } from "@react-rxjs/core";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/auth";
import { Loading } from "../components/loading";
import { FullPageLayout } from "../layout/full-page-layout";
import { settings$ } from "../settings/settings-state";
import { AppErrorBoundary } from "./app-error-boundary";
import { AppTheme } from "./app-theme";
import { ReloadPrompt } from "./reload-prompt";
const Desktop = lazy(() => import("../platform/Desktop"));

export const Application = () => (
  <Subscribe source$={settings$}>
    <AppTheme>
      <ReloadPrompt />
      <FullPageLayout>
        <AppErrorBoundary>
          <Subscribe fallback={<Loading />}>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<Desktop />} />
                {/* TODO: enable when mobile is ready */}
                {/* <Route path="/*" element={<TargetPlatform />} /> */}
              </Routes>
            </BrowserRouter>
          </Subscribe>
        </AppErrorBoundary>
      </FullPageLayout>
    </AppTheme>
  </Subscribe>
);
