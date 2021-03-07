export function cls(...values: (string | false | undefined)[]): string {
  return values.filter((x) => Boolean(x) && x != "").join(" ");
}

export function typedKeys<T extends Record<string, unknown>>(
  obj: T
): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export type ValueSetter<T> = T | ((old: T) => T);

export function fpSet<
  Target extends Record<string, any> | any[],
  P1 extends keyof Target,
  T extends Target[P1]
>(target: Target, p1: P1, value: ValueSetter<T>): Target;
export function fpSet<
  Target extends Record<string, any> | any[],
  P1 extends keyof Target,
  P2 extends keyof Target[P1],
  T extends Target[P1][P2]
>(target: Target, p1: P1, p2: P2, value: ValueSetter<T>): Target;
export function fpSet<
  Target extends Record<string, any> | any[],
  P1 extends keyof Target,
  P2 extends keyof Target[P1],
  P3 extends keyof Target[P1][P2],
  T extends Target[P1][P2][P3]
>(target: Target, p1: P1, p2: P2, p3: P3, value: ValueSetter<T>): Target;
export function fpSet(...args: any[]): any {
  const target = args[0];
  const path = args.slice(1, args.length - 1).map(String);
  const value = args[args.length - 1];
  return fpSetByArray(target, path, value);
}

export function fpSetByArray<T extends Record<string, any>>(
  target: T,
  path: (string | number)[],
  value: ValueSetter<any>
): T {
  if (path.length === 0) {
    if (typeof value === "function") {
      return value(target);
    }
    return value;
  }

  const firstPaths = path.slice(0, path.length - 1).map(String);
  const lastPath = path[path.length - 1];

  const newData = clone(target);

  let rollingTarget: any = newData;

  for (const seg of firstPaths) {
    rollingTarget[seg] = clone(rollingTarget[seg]);
    rollingTarget = rollingTarget[seg];
  }

  if (typeof value === "function") {
    rollingTarget[lastPath] = value(rollingTarget[lastPath]);
  } else {
    rollingTarget[lastPath] = value;
  }

  return newData;
}

function clone<T extends Record<string, unknown> | any[]>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.slice() as T;
  }
  return Object.assign({}, obj);
}

export function isTruthy<T>(value: T | null | undefined | false): value is T {
  return Boolean(value);
}
