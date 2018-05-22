import { IDMap } from "@/types";

import { Node, NodePin, NodesById } from "./types";
import { NodeTypes, EvolutionResult } from "./node-types";
import { SimulatorState } from "./state";

export function isWired(
  nodesById: NodesById,
  output: NodePin,
  input: NodePin
): boolean {
  const inputNode = nodesById[input.nodeId];

  if (!inputNode) {
    return false;
  }

  const conn = inputNode.inputConnectionsByPin[input.pin];
  if (!conn) {
    return false;
  }

  return conn.nodeId === output.nodeId && conn.pin === output.pin;
}
