import { PinConnection, NodesById } from "./types";

export function isWired(
  nodes: NodesById,
  output: PinConnection,
  input: PinConnection
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
