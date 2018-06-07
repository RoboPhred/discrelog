import produce from "immer";

import binarySearch from "binary-search";
import { remove } from "lodash-es";

import { SimulatorState } from "@/services/simulator/state";
import { DeleteNodeAction } from "@/services/simulator/actions";
import { typedKeys } from "@/utils";

function deleteNodeMutator(state: SimulatorState, action: DeleteNodeAction) {
  const { nodeIds } = action.payload;
  nodeIds.forEach(id => deleteNodeById(state, id));
}
export default produce(deleteNodeMutator);

function deleteNodeById(state: SimulatorState, nodeId: string) {
  const {
    nodesById,
    nodeStatesByNodeId,
    nodeOutputValuesByNodeId,
    nodeOutputTransitionsByNodeId,
    transitionsById,
    transitionWindows
  } = state;

  const node = nodesById[nodeId];
  if (!node) {
    return;
  }
  delete nodesById[nodeId];

  const { inputConnectionsByPin, outputConnectionsByPin } = node;

  for (const inputId of typedKeys(inputConnectionsByPin)) {
    const input = inputConnectionsByPin[inputId];
    if (!input) {
      continue;
    }

    const target = nodesById[input.nodeId];
    if (!target) {
      continue;
    }

    const conns = target.outputConnectionsByPin[input.pin];
    if (!conns) {
      continue;
    }

    remove(conns, x => x.nodeId === nodeId && x.pin === inputId);
  }

  for (const outputId of typedKeys(outputConnectionsByPin)) {
    const outputSet = outputConnectionsByPin[outputId];
    for (const conn of outputSet) {
      if (conn.nodeId === nodeId) {
        // Connected to self.
        continue;
      }

      const target = nodesById[conn.nodeId];
      const targetConn = target.inputConnectionsByPin[conn.pin];
      if (
        targetConn &&
        targetConn.nodeId === nodeId &&
        targetConn.pin === outputId
      ) {
        target.inputConnectionsByPin[conn.pin] = null;
      }
    }
  }

  delete nodeStatesByNodeId[nodeId];
  delete nodeOutputValuesByNodeId[nodeId];

  const transitionsByPin = nodeOutputTransitionsByNodeId[nodeId];
  for (const outputId of typedKeys(transitionsByPin)) {
    const transitionId = transitionsByPin[outputId];
    if (!transitionId) {
      continue;
    }

    const transition = transitionsById[transitionId];
    if (!transition) {
      continue;
    }

    // Remove transition
    delete transitionsById[transitionId];

    // Remove transition from windows
    const index = binarySearch(
      transitionWindows,
      transition.tick,
      (a, b) => a.tick - b
    );
    if (index >= 0) {
      const window = transitionWindows[index];
      const transitionIndex = window.transitionIds.indexOf(transitionId);
      if (transitionIndex > -1) {
        if (window.transitionIds.length === 1) {
          transitionWindows.splice(index, 1);
        } else {
          window.transitionIds.splice(transitionIndex, 1);
        }
      }
    }
  }
  delete nodeOutputTransitionsByNodeId[nodeId];
}
