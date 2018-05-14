
import { NodeDefinition } from "../types";

export const Nodes = {
    and: require("./node-and") as NodeDefinition,
    console: require("./node-console") as NodeDefinition,
    toggle: require("./node-toggle") as NodeDefinition
};
export type NodeType = keyof typeof Nodes;
