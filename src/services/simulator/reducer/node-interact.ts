import { AnyAction } from "redux";
import produce from "immer";

import { SimulatorState, defaultSimulatorState } from "../state";
import { NodeTypes } from "../node-types";

import { collectNodeTransitionsMutator } from "./transition-utils";
import { isInteractNodeAction } from "../actions/node-interact";

export default function nodeInteractReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  return produce(state, draft => interactNodeMutator(draft, action));
}

function interactNodeMutator(state: SimulatorState, action: AnyAction) {
  if (!isInteractNodeAction(action)) {
    return;
  }

  const { nodeId } = action.payload;
  const { nodesById, nodeStatesByNodeId } = state;

  const node = nodesById[nodeId];
  const type = NodeTypes[node.type];
  if (!type || !type.interact) {
    return;
  }

  const nodeState = nodeStatesByNodeId[nodeId];
  const newState = type.interact(nodeState);
  nodeStatesByNodeId[nodeId] = newState;

  collectNodeTransitionsMutator(state, nodeId);
}
