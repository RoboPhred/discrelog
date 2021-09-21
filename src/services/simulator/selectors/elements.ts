import { AppState } from "@/store";

import { getEvolverIdFromElementIdPath } from "@/services/simulator-graph/utils";
import { rootCircuitGraphSelector } from "@/services/simulator-graph/selectors/graph";

export const evolverStateFromCircuitElementIdSelector = (
  state: AppState,
  elementIdPath: string[]
) => {
  const { evolverIdsByElementId } = rootCircuitGraphSelector(state);
  const evolverStatesByEvolverId =
    state.services.simulator.evolverStatesByEvolverId;

  const evolverId = getEvolverIdFromElementIdPath(
    evolverIdsByElementId,
    elementIdPath
  );
  if (!evolverId) {
    return undefined;
  }

  return evolverStatesByEvolverId[evolverId];
};

export const elementOutputsFromCircuitElementIdSelector = (
  state: AppState,
  elementIdPath: string[]
) => {
  const { evolverIdsByElementId } = rootCircuitGraphSelector(state);
  const elementOutputsBySimulatorElementId =
    state.services.simulator.evolverOutputValuesByEvolverId;

  const evolverId = getEvolverIdFromElementIdPath(
    evolverIdsByElementId,
    elementIdPath
  );
  if (!evolverId) {
    return undefined;
  }

  return elementOutputsBySimulatorElementId[evolverId];
};

export const elementOutputFromCircuitElementPinSelector = (
  state: AppState,
  elementIdPath: string[],
  pin: string
) => {
  const outputs = elementOutputsFromCircuitElementIdSelector(
    state,
    elementIdPath
  );
  if (!outputs) {
    return false;
  }
  return outputs[pin] ?? false;
};
