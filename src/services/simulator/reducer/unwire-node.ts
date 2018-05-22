import produce from "immer";

import { SimulatorState } from "../state";
import { UnwireNodeAction } from "../actions";

import { evolveNode } from "../helpers";

export function unwireNodeMutator(state: SimulatorState, action: UnwireNodeAction) {
  const { sourceNodeId, sourcePin, targetNodeId, targetPin } = action.payload;

  const { tick, nodeStatesByNodeId, transitionWindows } = state;

  const sourceNode = state.nodesById[sourceNodeId];
  const targetNode = state.nodesById[targetNodeId];

  if (!sourceNode || !targetNode) {
    return;
  }

  const targetConn = targetNode.inputConnectionsByPin[targetPin];
  if (!targetConn) {
    return;
  }

  if (targetConn.nodeId !== sourceNodeId || targetConn.pin !== sourcePin) {
    return;
  }
  targetNode.inputConnectionsByPin[targetPin] = null;

  const outConns = sourceNode.outputConnectionsByPin[sourcePin];
  if (!outConns) {
    return;
  }

  const sourceConnIndex = outConns.findIndex(
    c => c.nodeId === targetNodeId && c.pin === targetPin
  );
  if (sourceConnIndex === -1) {
    return;
  }
  outConns.splice(sourceConnIndex, 1);

  // Evolve with the new inputs.
  evolveNode(state, targetNode);
}

export default produce(unwireNodeMutator);
