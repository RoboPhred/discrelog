import produce from "immer";

import { SimulatorState } from "../state";
import { WireNodeAction } from "../actions";

import { collectNodeTransitionsMutator } from "./collect-transitions";

export function wireNodeMutator(state: SimulatorState, action: WireNodeAction) {
  const { sourceNodeId, sourcePin, targetNodeId, targetPin } = action.payload;

  const sourceNode = state.nodesById[sourceNodeId];
  const targetNode = state.nodesById[targetNodeId];

  if (!sourceNode || !targetNode) {
    return;
  }

  // Only one source per input.
  if (targetNode.inputConnectionsByPin[targetPin]) {
    return;
  }

  // Tell the target about the source.
  targetNode.inputConnectionsByPin[targetPin] = {
    nodeId: sourceNodeId,
    pin: sourcePin
  };

  // Tell the source about the target.
  sourceNode.outputConnectionsByPin[sourcePin].push({
    nodeId: targetNodeId,
    pin: targetPin
  });

  collectNodeTransitionsMutator(state, targetNodeId);
}

export default produce(wireNodeMutator);
