import pickBy from "lodash/pickBy";

import {
  ElementVisualPath,
  ElementDefinition,
  ElementPinDefinition,
} from "./types";

export function normalizeVisuals(
  v: ElementVisualPath | ElementVisualPath[],
  state: any
): { path: string; fill?: string; stroke?: string; strokeWidth?: number }[] {
  const asArray = Array.isArray(v) ? v : [v];

  return asArray.map((x) => {
    if (typeof x === "string") {
      return {
        path: x,
        fill: "black",
        stroke: "black",
        strokeWidth: 2,
      };
    }
    const fill = typeof x.fill === "function" ? x.fill(state || {}) : x.fill;
    const stroke =
      typeof x.stroke === "function" ? x.stroke(state || {}) : x.stroke;
    const strokeWidth =
      typeof x.strokeWidth === "function"
        ? x.strokeWidth(state || {})
        : x.strokeWidth;
    return {
      path: x.path,
      fill,
      stroke,
      strokeWidth,
    };
  });
}

export function inputsOf(
  def: ElementDefinition
): Record<string, ElementPinDefinition> {
  return pickBy(def.pins, (value) => value.direction === "input") as Record<
    string,
    ElementPinDefinition
  >;
}

export function outputsOf(
  def: ElementDefinition
): Record<string, ElementPinDefinition> {
  return pickBy(def.pins, (value) => value.direction === "output") as Record<
    string,
    ElementPinDefinition
  >;
}
