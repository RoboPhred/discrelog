import mapValues from "lodash/mapValues";

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export interface FunctionKeyedObject {
  [key: string]: Function;
}
export function bindFuncMap<T extends FunctionKeyedObject>(
  obj: T,
  target: any
): T {
  return mapValues(obj, v => v.bind(target)) as T;
}

export function* iterateTakeWhile<T>(
  items: T[],
  predicate: (item: T) => boolean
): IterableIterator<T> {
  while (items.length > 0) {
    const item = items[0];
    if (!predicate(item)) {
      break;
    }
    const nextItem = items.shift()!;
    yield nextItem;
  }
}
