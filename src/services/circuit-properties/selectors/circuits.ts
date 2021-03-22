import { CircuitPropertiesServiceState } from "../state";
import { createCircuitPropertiesSelector } from "../utils";

export const circuitIdsSelector = createCircuitPropertiesSelector((state) =>
  Object.keys(state.circuitNamesByCircuitId)
);

export const circuitNamesByIdSelector = createCircuitPropertiesSelector(
  (state) => state.circuitNamesByCircuitId
);

export const circuitNameFromIdSelector = createCircuitPropertiesSelector(
  (state: CircuitPropertiesServiceState, circuitId: string) =>
    state.circuitNamesByCircuitId[circuitId]
);
