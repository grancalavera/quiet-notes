export function hasOwnProperty<TProperty extends PropertyKey>(
  source: unknown,
  property: TProperty
): source is { [key in TProperty]: unknown } & Record<
  typeof property,
  unknown
> {
  return (
    typeof source === "object" &&
    source !== null &&
    source.hasOwnProperty(property)
  );
}

export function hasProperty<TProperty extends PropertyKey>(
  source: unknown,
  property: TProperty
): source is { [key in TProperty]: unknown } & Record<
  typeof property,
  unknown
> {
  return typeof source === "object" && source !== null && property in source;
}
