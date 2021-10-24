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
import { useAppState } from "./app-state";
import Typography from "@mui/material/Typography";

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
                <DialogContentText id="error-alert-description">
                  <Typography variant="body1">{error.code}</Typography>
                </DialogContentText>
                {process.env.NODE_ENV === "development" && (
                  <Typography variant="body1">{error.message}</Typography>
                )}
              </DialogContent>
            </>
          );
        } else if (isQnError(error)) {
          return (
            <>
              <DialogTitle id="error-alert-title">{error.name}</DialogTitle>
              <DialogContent>
                <DialogContentText id="error-alert-description">
                  {error.message}
                </DialogContentText>
                {process.env.NODE_ENV === "development" && (
                  <>
                    <Typography variant="body1">
                      Come back soon to check if it has been approved.
                    </Typography>
                    <pre>{JSON.stringify(error.data ?? {}, null, 2)}</pre>
                  </>
                )}
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
