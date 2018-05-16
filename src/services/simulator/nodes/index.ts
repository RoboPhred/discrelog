
import { NodeDefinition } from "../types";

export const Nodes = {
    and: require("./node-and") as NodeDefinition,
    led: require("./node-led") as NodeDefinition,
    toggle: require("./node-toggle") as NodeDefinition
};
export type NodeType = keyof typeof Nodes;
