import produce from "immer";

import { SimulatorState } from "../state";
import { InteractNodeAction } from "../actions";
import { NodeTypes } from "../node-types";

import { applyNodeEvolution } from "../helpers";

export function interactNodeMutator(state: SimulatorState, action: InteractNodeAction) {
  const { nodeId } = action.payload;
  const { tick, nodesById, nodeStatesByNodeId, transitionWindows } = state;

  const node = nodesById[nodeId];
  const type = NodeTypes[node.type];
  if (!type || !type.interact) {
    return;
  }
  const evolution = type.interact(nodeStatesByNodeId[nodeId]);
  applyNodeEvolution(node, tick, evolution, nodeStatesByNodeId, transitionWindows);
  return;
}

export default produce(interactNodeMutator);