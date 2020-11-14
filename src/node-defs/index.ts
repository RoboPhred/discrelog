import values from "lodash/values";
import getBounds from "svg-path-bounds";

import { calcSize, union, ZeroRect } from "@/geometry";

import { NodeDefinition } from "./types";
import { normalizeVisuals } from "./utils";

export * from "./types";

// Many of these art assets used in these files are public domain and sourced from
//  https://commons.wikimedia.org/wiki/Logic_gates_unified_symbols
// Some assets have been modified for formatting or added functionality.
// Assets that have been pulled from external sources are marked as such.

export const NodeTypes = {
  and: require("./node-and").default as NodeDefinition,
  or: require("./node-or").default as NodeDefinition,
  nor: require("./node-nor").default as NodeDefinition,
  not: require("./node-not").default as NodeDefinition,
  buffer: require("./node-buffer").default as NodeDefinition,
  led: require("./node-led").default as NodeDefinition,
  toggle: require("./node-toggle").default as NodeDefinition,
  seg7: require("./node-seg7").default as NodeDefinition,
};
export type NodeType = keyof typeof NodeTypes;

export const MaxNodeSize = calcSize(
  values(NodeTypes).reduce((bounds, { visual }) => {
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
