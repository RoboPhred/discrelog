
import { NodeDefinition } from "../types";

export const Nodes = {
    and: require("./node-and").default as NodeDefinition,
    led: require("./node-led").default as NodeDefinition,
    toggle: require("./node-toggle").default as NodeDefinition
};
export type NodeType = keyof typeof Nodes;
