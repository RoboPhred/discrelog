import has from "lodash/has";

export type TesselWindowRenderer = (
  window: TesselWindowItem
) => React.ReactElement | null;

export interface TesselWindowItem {
  windowId: string;
  windowProps?: Record<string, any>;
}

export type TesselDirection = "row" | "column";

export interface TesselSplitItem {
  first: TesselValue;
  second: TesselValue;
  direction: TesselDirection;
  divisionPercent: number;
}

export type TesselItem = TesselWindowItem | TesselSplitItem;
export type TesselValue = string | TesselItem;

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
