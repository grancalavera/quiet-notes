import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { isFirebaseError, isQnError } from "./app-error";
import { useAppErrors, useDismissError } from "./app-state";

export class AppErrorBoundary extends React.Component<{}, { hasError: boolean; error?: unknown }> {
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
  const [nextError] = useAppErrors();
  const dismissError = useDismissError();
  return <ErrorAlert error={nextError} onClose={dismissError} isOpen={!!nextError} />;
};

interface ErrorAlertProps {
  error: unknown;
  isOpen: boolean;
  onClose: () => void;
}

const ErrorAlert = ({ error, ...props }: ErrorAlertProps) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="error-alert-title"
      aria-describedby="error-alert-description"
    >
      {(() => {
        if (isFirebaseError(error)) {
          return (
            <>
              <DialogTitle id="error-alert-title">{error.name}</DialogTitle>
              <DialogContent>
                <DialogContentText id="error-alert-description" sx={{ whiteSpace: "pre-wrap" }}>
                  {error.code} {process.env.NODE_ENV === "development" && `\n\n${error.message}`}
                </DialogContentText>
              </DialogContent>
            </>
          );
        } else if (isQnError(error)) {
          return (
            <>
              <DialogTitle id="error-alert-title">{error.name}</DialogTitle>
              <DialogContent>
                <DialogContentText id="error-alert-description">{error.message}</DialogContentText>
              </DialogContent>
            </>
          );
        } else {
          return (
            <>
              <DialogTitle id="error-alert-title">Fatal Error</DialogTitle>
              <DialogContentText id="error-alert-decription">
                Something went wrong! Please reload the page.
              </DialogContentText>
            </>
          );
        }
      })()}
      <DialogActions>
        <Button onClick={props.onClose}>ok</Button>
      </DialogActions>
    </Dialog>
  );
};
