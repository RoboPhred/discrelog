import { EvolverDefinitionsByType } from "@/evolvers";

import { isInteractElementAction } from "@/actions/element-interact";
import {
  evolverIdFromElementIdSelector,
  evolverTypeFromEvolverId,
} from "@/services/simulator-graph/selectors/elements";

import { createSimulatorReducer } from "../utils";

import { applyEvolutionResult } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isInteractElementAction(action)) {
    return state;
  }

  const { elementIdPath, data } = action.payload;
  const evolverId = evolverIdFromElementIdSelector(appState, elementIdPath);

  if (!evolverId) {
    return state;
  }

  const elementType = evolverTypeFromEvolverId(appState, evolverId);
  if (!elementType) {
    return state;
  }

  const def = EvolverDefinitionsByType[elementType];
  if (!def || !def.interact) {
    return state;
  }

  const evolverState = state.evolverStatesByEvolverId[evolverId];
  const evolutionResult = def.interact(evolverState, data);

  return applyEvolutionResult(state, evolverId, evolutionResult);
});
