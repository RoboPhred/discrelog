import has from "lodash/has";

export type TesselWindowRenderer = (
  window: TesselWindowItem
) => React.ReactElement | null;

export interface TesselWindowItem<P = Record<string, any>> {
  windowId: string;
  windowProps?: P;
}

export type TesselDirection = "row" | "column";

export interface TesselPercentDivision {
  firstPercent: number;
}
export interface TesselFixedDivision {
  firstSize?: number;
  secondSize?: number;
}
export type TesselDivision = TesselPercentDivision | TesselFixedDivision;
export type TesselDivisionValue = number | TesselDivision;

export interface TesselSplitItem {
  first: TesselValue;
  second: TesselValue;
  direction: TesselDirection;
  division: TesselDivisionValue;
}

export type TesselItem = TesselWindowItem | TesselSplitItem;
export type TesselValue = string | TesselItem;

export type TesselDropPosition = "left" | "right" | "top" | "bottom";

export function normalizeTesselItem(value: TesselValue): TesselItem {
  if (typeof value === "string") {
    return {
      windowId: value,
    };
  }

  return value;
}

export function isTesselWindow(item: TesselItem): item is TesselWindowItem {
  return has(item, "windowId");
}

export function isTesselSplit(item: TesselItem): item is TesselSplitItem {
  return has(item, "first") && has(item, "second") && has(item, "direction");
}

export function normalizeTesselDivision(
  value: TesselDivisionValue
): TesselDivision {
  if (typeof value === "number") {
    return {
      firstPercent: value,
    };
  }

  return value;
}

export function isTesselPercentDivision(
  value: TesselDivision
): value is TesselPercentDivision {
  return has(value, "firstPercent");
}

export function isTesselFixedDivision(
  value: TesselDivision
): value is TesselFixedDivision {
  return has(value, "firstSize") || has(value, "secondSize");
}
