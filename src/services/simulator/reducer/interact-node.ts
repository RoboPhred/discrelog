import produce from "immer";

import { SimulatorState } from "../state";
import { InteractNodeAction } from "../actions";
import { NodeTypes } from "../node-types";

import { collectNodeTransitionsMutator } from "./collect-transitions";

export function interactNodeMutator(
  state: SimulatorState,
  action: InteractNodeAction
) {
  const { nodeId } = action.payload;
  const { nodesById, nodeStatesByNodeId } = state;

  const node = nodesById[nodeId];
  const type = NodeTypes[node.type];
  if (!type || !type.interact) {
    return;
  }

  const nodeState = nodeStatesByNodeId[nodeId];
  const newState = type.interact(nodeStatesByNodeId[nodeId]);
  nodeStatesByNodeId[nodeId] = newState;

  collectNodeTransitionsMutator(state, nodeId);
}

export default produce(interactNodeMutator);
