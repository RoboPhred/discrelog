import { NodeDefinition } from "../types";

// Art from https://commons.wikimedia.org/wiki/Logic_gates_unified_symbols

export const NodeTypes = {
  and: require("./node-and").default as NodeDefinition,
  or: require("./node-or").default as NodeDefinition,
  nor: require("./node-nor").default as NodeDefinition,
  not: require("./node-not").default as NodeDefinition,
  led: require("./node-led").default as NodeDefinition,
  toggle: require("./node-toggle").default as NodeDefinition,
  seg7: require("./node-seg7").default as NodeDefinition
};
export type NodeType = keyof typeof NodeTypes;
