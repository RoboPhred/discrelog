import values from "lodash/values";
import getBounds from "svg-path-bounds";

import { calcSize, union, ZeroRect } from "@/geometry";

import { normalizeVisuals } from "../utils";
import { ElementDefinition } from "../types";

export const ElementDefinitionsByType = {
  and: require("./element-and").default as ElementDefinition,
  or: require("./element-or").default as ElementDefinition,
  nor: require("./element-nor").default as ElementDefinition,
  not: require("./element-not").default as ElementDefinition,
  buffer: require("./element-buffer").default as ElementDefinition,
  led: require("./element-led").default as ElementDefinition,
  toggle: require("./element-toggle").default as ElementDefinition,
  seg7: require("./element-seg7").default as ElementDefinition,
};
export type ElementType = keyof typeof ElementDefinitionsByType;

export const LargestElementSize = calcSize(
  values(ElementDefinitionsByType).reduce((bounds, { visual }) => {
    const visuals = normalizeVisuals(visual.shapePath, undefined);
    if (visual.hitPath) {
      visuals.push({ path: visual.hitPath });
    }
    const rect = visuals
      .map((path) => {
        const bounds = getBounds(path.path);
        return {
          p1: {
            x: bounds[0],
            y: bounds[1],
          },
          p2: {
            x: bounds[2],
            y: bounds[3],
          },
        };
      })
      .reduce(union, ZeroRect);
    return union(bounds, rect);
  }, ZeroRect)
);
