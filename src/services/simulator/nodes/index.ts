import { NodeDefinition } from "../types";

export const NodeTypes = {
  and: require("./node-and").default as NodeDefinition,
  or: require("./node-or").default as NodeDefinition,
  not: require("./node-not").default as NodeDefinition,
  led: require("./node-led").default as NodeDefinition,
  toggle: require("./node-toggle").default as NodeDefinition
};
export type NodeType = keyof typeof NodeTypes;
