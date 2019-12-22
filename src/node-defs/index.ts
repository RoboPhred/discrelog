import { NodeDefinition } from "./types";

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
  seg7: require("./node-seg7").default as NodeDefinition
};
export type NodeType = keyof typeof NodeTypes;
