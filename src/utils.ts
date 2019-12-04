import { mapValues } from "lodash-es";

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
