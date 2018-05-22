import { IDMap } from "@/types";

import { SimulatorState } from "../state";
import { PinValueMap } from "../types";

export function applyTransitionsMutator(
  state: SimulatorState,
  transitionsByNode: IDMap<PinValueMap>
) {
  const { nodesById, nodeOutputValuesByNodeId } = state;

  const dirtySet = new Set(state.dirtyInputNodeIds);

  for (const nodeId of Object.keys(transitionsByNode)) {
    const node = nodesById[nodeId];
    if (!node) {
      continue;
    }

    const outputValues = nodeOutputValuesByNodeId[nodeId];
    if (!outputValues) {
      continue;
    }

    const transitionMap = transitionsByNode[nodeId];
    for (const pin of Object.keys(transitionMap)) {
      if (outputValues[pin] === transitionMap[pin]) {
        continue;
      }

      outputValues[pin] = transitionMap[pin];
      const outputConns = node.outputConnectionsByPin[pin];
      for (const conn of outputConns) {
        dirtySet.add(conn.nodeId);
      }
    }
  }

  state.dirtyInputNodeIds = Array.from(dirtySet);
}
