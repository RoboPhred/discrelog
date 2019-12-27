import { AnyAction } from "redux";
import produce from "immer";

import binarySearch from "binary-search";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { SimulatorState } from "../state";

import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action) => {
  return produce(state, draft => deleteNodeMutator(draft, action));
});

function deleteNodeMutator(state: SimulatorState, action: AnyAction) {
  if (!isDeleteNodeAction(action)) {
    return;
  }

  const { nodeIds } = action.payload;
  nodeIds.forEach(id => deleteNodeById(state, id));
}

function deleteNodeById(state: SimulatorState, nodeId: string) {
  const {
    nodeStatesByNodeId,
    nodeOutputValuesByNodeId,
    transitionsById,
    transitionWindows
  } = state;

  delete nodeStatesByNodeId[nodeId];
  delete nodeOutputValuesByNodeId[nodeId];

  const nodeTransitionIds = Object.keys(transitionsById).filter(
    id => transitionsById[id].nodeId === nodeId
  );
  for (const transitionId of nodeTransitionIds) {
    const transition = transitionsById[transitionId];

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
}