import { VFC } from "react";
import { useSelectedNoteId } from "../notebook/notebook-state";

interface WithNoteIdProps {
  noteId: string;
}

type ComponentProps<T extends WithNoteIdProps> = Omit<T, keyof WithNoteIdProps>;

export function withNoteId<T extends WithNoteIdProps>(Component: VFC<T>): VFC<ComponentProps<T>> {
  const displayName = Component.displayName ?? Component.name ?? "Component";

  const WithNoteId: VFC<ComponentProps<T>> = (props: ComponentProps<T>) => {
    const noteId = useSelectedNoteId();

    // https://github.com/microsoft/TypeScript/issues/35858#issuecomment-573909154
    const p: T = { ...props, noteId } as T;

    return noteId ? <Component {...p} /> : null;
  };

  WithNoteId.displayName = `withNoteId(${displayName})`;

  return WithNoteId;
}
