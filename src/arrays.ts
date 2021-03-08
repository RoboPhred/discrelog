export type MaybeArray<T> = T | T[];
export function asArray<T>(value: MaybeArray<T>): T[] {
  return Array.isArray(value) ? value : [value];
}

export function arrayEquals<T extends any[]>(a: T, b: T) {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  return a.every((v, i) => b[i] === v);
}

const EmptyArray: ReadonlyArray<unknown> = Object.freeze([]);
// Would be simpler to just use EmptyArray, but we cannot type that to what the usage wants.
// Shame the type `[]` is invalid.
export function immutableEmptyArray<T>(): T[] {
  return EmptyArray as any;
}

export function dropIndexFp<T>(array: T[], index: number) {
  const newArray = array.slice(0, index);
  for (let i = index + 1; i < array.length; i++) {
    newArray.push(array[i]);
  }
  return newArray;
}
