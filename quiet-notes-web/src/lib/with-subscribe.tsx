import { Subscribe } from "@react-rxjs/core";
import { Observable } from "rxjs";
import { LoadingLayout } from "../layout/loading-layout";

interface WithSubscribeOptions {
  source$?: Observable<unknown>;
  FallbackComponent?: React.ComponentType | null;
}

export function withSubscribe<T>(
  Component: React.ComponentType<T>,
  options: WithSubscribeOptions = {}
) {
  const { source$, FallbackComponent } = options;

  const fallback = FallbackComponent ? (
    <FallbackComponent />
  ) : FallbackComponent === null ? null : (
    <LoadingLayout />
  );

  return (props: T) => (
    <Subscribe source$={source$} fallback={fallback}>
      <Component {...props} />
    </Subscribe>
  );
}
