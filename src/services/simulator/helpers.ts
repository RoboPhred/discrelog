import { NodePin, NodesById } from "./types";

export function isWired(
  nodes: NodesById,
  output: NodePin,
  input: NodePin
): boolean {
  const inputNode = nodes[input.nodeId];

  if (!inputNode) {
    return false;
  }

  const conn = inputNode.inputConnectionsByPin[input.pin];
  if (!conn) {
    return false;
  }

  return conn.nodeId === output.nodeId && conn.pin === output.pin;
}
