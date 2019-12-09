import { fpSet } from "@/utils";

import { NodeTypes } from "../node-types";

import { isInteractNodeAction } from "../actions/node-interact";

import { collectNodeTransitions } from "./transition-utils";
import { createSimulatorReducer } from "./utils";

export default createSimulatorReducer((state, action) => {
  if (!isInteractNodeAction(action)) {
    return state;
  }

  const { nodeId } = action.payload;
  const { nodesById, nodeStatesByNodeId } = state;

  const node = nodesById[nodeId];
  const type = NodeTypes[node.type];
  if (!type || !type.interact) {
    return state;
  }

  const nodeState = nodeStatesByNodeId[nodeId];
  const newState = type.interact(nodeState);
  state = fpSet(state, "nodeStatesByNodeId", nodeId, newState);

  return collectNodeTransitions(state, nodeId);
});
