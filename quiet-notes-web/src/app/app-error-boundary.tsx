import { Alert, H4 } from "@blueprintjs/core";
import React, { useState } from "react";
import { isFirebaseError, isQnError } from "./app-error";
import { useAppState } from "./app-state";

export class AppErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error?: unknown }
> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: any) {
    console.error({ error, info });
  }

  render() {
    return (
      <>
        {this.state.hasError ? (
          <GlobalErrorHandler error={this.state.error} />
        ) : (
          this.props.children
        )}
        <AppErrorHandler />
      </>
    );
  }
}

interface GlobalErrorHandlerProps {
  error: unknown;
}

const GlobalErrorHandler = ({ error }: GlobalErrorHandlerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  return <ErrorAlert error={error} onClose={() => setIsOpen(false)} isOpen={isOpen} />;
};

const AppErrorHandler = () => {
  const [nextError] = useAppState((s) => s.errors);
  const dismissError = useAppState((s) => s.dismissError);
  return <ErrorAlert error={nextError} onClose={dismissError} isOpen={!!nextError} />;
};

interface ErrorAlertProps {
  error: unknown;
  isOpen: boolean;
  onClose: () => void;
}

const ErrorAlert = ({ error, ...props }: ErrorAlertProps) => {
  return (
    <Alert intent="danger" icon="error" {...props}>
      {(() => {
        if (isFirebaseError(error)) {
          return (
            <div>
              <H4>{error.name}</H4>
              <p>{error.code}</p>
              {process.env.NODE_ENV === "development" && <p>{error.message}</p>}
            </div>
          );
        } else if (isQnError(error)) {
          return (
            <div>
              <H4>{error.name}</H4>
              <p>{error.message}</p>
              {process.env.NODE_ENV === "development" && (
                <pre>{JSON.stringify(error.data ?? {}, null, 2)}</pre>
              )}
            </div>
          );
        } else {
          return (
            <div>
              <H4>Fatal Error</H4>
              <p>Something went wrong! Please reload the page.</p>
            </div>
          );
        }
      })()}
    </Alert>
  );
};
