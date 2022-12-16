import { Subscribe } from "@react-rxjs/core";
import { ReactNode } from "react";
import { Observable } from "rxjs";
import { Loading } from "../components/loading";

interface WithSubscribeOptions {
  source$?: Observable<unknown>;
  fallback?: ReactNode | null;
}

export function withSubscribe<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  options: WithSubscribeOptions = {}
) {
  const { source$, fallback } = options;

  const actualFallback = fallback ? (
    fallback
  ) : fallback === null ? null : (
    <Loading />
  );

  return (props: T) => (
    <Subscribe source$={source$} fallback={actualFallback}>
      <Component {...props} />
    </Subscribe>
  );
}
