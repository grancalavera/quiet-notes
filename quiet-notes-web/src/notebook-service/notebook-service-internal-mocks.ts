import { useNoteInternal, useNotesCollectionInternal } from "./notebook-service-internal";

jest.mock("./notebook-service-internal", () => ({
  useNotesCollectionInternal: jest.fn(),
  useNoteInternal: jest.fn(),
}));

export const useNotesCollectionInternal_mock =
  useNotesCollectionInternal as jest.MockedFunction<typeof useNotesCollectionInternal>;

export const useNoteInternal_mock = useNoteInternal as jest.MockedFunction<
  typeof useNoteInternal
>;
