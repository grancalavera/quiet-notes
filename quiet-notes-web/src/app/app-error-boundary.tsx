import { Alert, H4 } from "@blueprintjs/core";
import React from "react";
import { useNotebookState } from "../notebook/notebook-local-state";

export class AppErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return (
      <>
        {this.state.hasError ? <UnknownErrorHandler /> : this.props.children}
        <AppErrorHandler />
      </>
    );
  }
}

const UnknownErrorHandler = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Alert intent="danger" icon="error" onClose={() => setIsOpen(false)} isOpen={isOpen}>
      <p>Something went wrong!</p>
    </Alert>
  );
};

const AppErrorHandler = () => {
  const [nextError] = useNotebookState((s) => s.errors);
  const dismissError = useNotebookState((s) => s.dismissError);

  return (
    <Alert intent="danger" icon="error" onClose={dismissError} isOpen={!!nextError}>
      {nextError && (
        <div>
          <H4>{nextError.name}</H4>
          <p>{nextError.code}</p>
        </div>
      )}
    </Alert>
  );
};
