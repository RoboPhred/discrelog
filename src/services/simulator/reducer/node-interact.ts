import { ElementDefinitionsByType } from "@/elements";

import { isInteractNodeAction } from "@/actions/node-interact";
import {
  simulatorNodeIdFromCircuitNodeIdSelector,
  elementTypeFromSimulatorNodeId,
} from "@/services/simulator-graph/selectors/nodes";

import { createSimulatorReducer } from "../utils";

import { applyEvolutionResult } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isInteractNodeAction(action)) {
    return state;
  }

  const { circuitNodeIdPath, data } = action.payload;
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
  const evolutionResult = def.interact(nodeState, data);

  return applyEvolutionResult(state, simulatorNodeId, evolutionResult);
});
