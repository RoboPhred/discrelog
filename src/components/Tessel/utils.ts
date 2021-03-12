import { isTesselSplit, normalizeTesselItem, TesselValue } from "./types";

export function walkTesselValues(
  value: TesselValue,
  walk: (value: TesselValue, path: string[]) => boolean | undefined
) {
  function doWork(value: TesselValue, path: string[]): boolean {
    if (walk(value, []) === false) {
      return false;
    }

    const normalized = normalizeTesselItem(value);
    if (isTesselSplit(normalized)) {
      if (!doWork(normalized.first, [...path, "first"])) {
        return false;
      }
      if (!doWork(normalized.second, [...path, "second"])) {
        return false;
      }
    }

    return true;
  }

  doWork(value, []);
}

export function filterTesselValues(
  value: TesselValue,
  filter: (value: TesselValue) => boolean
): TesselValue | null {
  if (!filter(value)) {
    return null;
  }

  const normalized = normalizeTesselItem(value);

  if (isTesselSplit(normalized)) {
    const first = filterTesselValues(normalized.first, filter);
    const second = filterTesselValues(normalized.second, filter);

    if (first && second) {
      return value;
    }

    return first ?? second ?? null;
  }

  return value;
}

export function findAndReplaceTesselValue(
  value: TesselValue,
  replace: (value: TesselValue) => TesselValue | null
): TesselValue {
  function doWork(value: TesselValue): TesselValue | null {
    const newValue = replace(value);
    if (newValue) {
      return newValue;
    }

    const normalized = normalizeTesselItem(value);
    if (isTesselSplit(normalized)) {
      const first = doWork(normalized.first);
      if (first) {
        return {
          ...normalized,
          first,
        };
      }

      const second = doWork(normalized.second);
      if (second) {
        return {
          ...normalized,
          second,
        };
      }
    }

    return null;
  }
  return doWork(value) ?? value;
}

export function pruneEmptyTesselValues(value: TesselValue): TesselValue {
  if (typeof value === "string") {
    return value;
  }

  if (isTesselSplit(value)) {
    if (value.first == null) {
      return pruneEmptyTesselValues(value.second);
    }
    if (value.second == null) {
      return pruneEmptyTesselValues(value.first);
    }
    return {
      ...value,
      first: pruneEmptyTesselValues(value.first),
      second: pruneEmptyTesselValues(value.second),
    };
  }

  return value;
}
