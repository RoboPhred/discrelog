import { AnyAction } from "redux";

import { SimulatorState, defaultSimulatorState } from "../state";
import { NodeTypes } from "../node-types";

import { collectNodeTransitions } from "./transition-utils";
import { isInteractNodeAction } from "../actions/node-interact";

export default function nodeInteractReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
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
  state = {
    ...state,
    nodeStatesByNodeId: {
      ...state.nodeStatesByNodeId,
      [nodeId]: newState
    }
  }

  return collectNodeTransitions(state, nodeId);
}

