export function cls(...values: (string | false | undefined)[]): string {
  return values.filter((x) => Boolean(x) && x != "").join(" ");
}

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
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
export function fpSet(...args: any[]) {
  let target = args[0];
  const firstPaths = args.slice(1, args.length - 2).map(String);
  const lastPath = args[args.length - 2];
  const value = args[args.length - 1];

  const newData = clone(target);
  target = newData;

  for (const seg of firstPaths) {
    target[seg] = clone(target[seg]);
    target = target[seg];
  }

  if (typeof value === "function") {
    target[lastPath] = value(target[lastPath]);
  } else {
    target[lastPath] = value;
  }

  return newData;
}

function clone<T extends object | any[]>(obj: T): T {
  if (Array.isArray(obj)) {
    return [...obj] as T;
  }
  return { ...obj };
}
