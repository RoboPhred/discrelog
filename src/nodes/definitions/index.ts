import values from "lodash/values";
import getBounds from "svg-path-bounds";

import { calcSize, union, ZeroRect } from "@/geometry";

import { NodeDefinition } from "../types";

export const NodeDefinitionsByType = {
  and: require("./node-and").default as NodeDefinition,
  or: require("./node-or").default as NodeDefinition,
  nor: require("./node-nor").default as NodeDefinition,
  not: require("./node-not").default as NodeDefinition,
  buffer: require("./node-buffer").default as NodeDefinition,
  led: require("./node-led").default as NodeDefinition,
  toggle: require("./node-toggle").default as NodeDefinition,
  seg7: require("./node-seg7").default as NodeDefinition,
};
export type NodeType = keyof typeof NodeDefinitionsByType;

export const LargestNodeSize = calcSize(
  values(NodeDefinitionsByType).reduce((bounds, { visual }) => {
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
