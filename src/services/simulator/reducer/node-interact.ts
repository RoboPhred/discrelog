import { fpSet } from "@/utils";

import { isInteractNodeAction } from "@/actions/node-interact";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./utils";
import { elementDefFromNodeIdSelector } from "@/services/graph/selectors/nodes";

export default createSimulatorReducer((state, action, appState) => {
  if (!isInteractNodeAction(action)) {
    return state;
  }

  const { nodeId } = action.payload;

  const def = elementDefFromNodeIdSelector(appState, nodeId);

  if (!def || !def.interact) {
    return state;
  }

  const nodeState = state.nodeStatesByNodeId[nodeId];
  const newState = def.interact(nodeState);
  state = fpSet(state, "nodeStatesByNodeId", nodeId, newState);

  return collectNodeTransitions(state, nodeId, appState);
});
