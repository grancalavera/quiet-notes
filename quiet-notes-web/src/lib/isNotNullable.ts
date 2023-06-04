/**
 * Checks if a value is not null or undefined.
 *
 * This function is useful for when you want to check that a value is
 * not null or undefined, but you don't want to go through the hassle
 * of writing out the whole `value !== null && value !== undefined`
 * expression.
 *
 * @param x The value to check.
 * @returns `true` if the value is not null or undefined, `false`
 * otherwise.
 */
export const isNotNullable = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined;

/**
 * Remove null and undefined values from an array.
 *
 * @param xs - The array to remove null and undefined values from.
 */
export const removeNullables = <T>(xs: (T | null | undefined)[]): T[] =>
  xs.filter(isNotNullable);
