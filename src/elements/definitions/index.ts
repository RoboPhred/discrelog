import values from "lodash/values";
import getBounds from "svg-path-bounds";

import { calcSize, union, ZeroRect } from "@/geometry";

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
    const elementBounds = getBounds(visual.hitPath);
    const elementRect = {
      p1: {
        x: elementBounds[0],
        y: elementBounds[1],
      },
      p2: {
        x: elementBounds[2],
        y: elementBounds[3],
      },
    };
    return union(elementRect, bounds);
  }, ZeroRect)
);
