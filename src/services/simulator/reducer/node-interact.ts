import { fpSet } from "@/utils";

import { ElementDefinitionsByType } from "@/elements";

import { isInteractNodeAction } from "@/actions/node-interact";
import {
  simulatorNodeIdFromCircuitNodeIdSelector,
  elementTypeFromSimulatorNodeId,
} from "@/services/simulator-graph/selectors/nodes";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isInteractNodeAction(action)) {
    return state;
  }

  const { circuitNodeIdPath } = action.payload;
  const simulatorNodeId = simulatorNodeIdFromCircuitNodeIdSelector(
    appState,
    circuitNodeIdPath
  );

  if (!simulatorNodeId) {
    return state;
  }

  const elementType = elementTypeFromSimulatorNodeId(appState, simulatorNodeId);
  if (!elementType) {
    return state;
  }

  const def = ElementDefinitionsByType[elementType];
  if (!def || !def.interact) {
    return state;
  }

  const nodeState = state.nodeStatesByNodeId[simulatorNodeId];
  const newState = def.interact(nodeState);
  state = fpSet(state, "nodeStatesByNodeId", simulatorNodeId, newState);

  return collectNodeTransitions(state, simulatorNodeId, appState);
});
