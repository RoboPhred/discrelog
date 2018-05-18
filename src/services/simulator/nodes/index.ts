import { NodeDefinition } from "../types";

export const NodeTypes = {
  and: require("./node-and").default as NodeDefinition,
  led: require("./node-led").default as NodeDefinition,
  toggle: require("./node-toggle").default as NodeDefinition
};
export type NodeType = keyof typeof NodeTypes;
