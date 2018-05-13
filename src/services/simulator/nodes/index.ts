
import { NodeDefinition } from "../types";

export const NODES = {
    AND: require("./node-and") as NodeDefinition
};
export type NodeType = keyof typeof NODES;