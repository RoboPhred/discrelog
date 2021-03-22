import { ROOT_CIRCUIT_ID } from "../circuits/constants";

export interface CircuitPropertiesServiceState {
  /**
   * The user-provided names for circuits by circuit id.
   */
  circuitNamesByCircuitId: Record<string, string>;
}

const _defaultState: CircuitPropertiesServiceState = {
  circuitNamesByCircuitId: {
    [ROOT_CIRCUIT_ID]: "Root",
  },
};

export const defaultCircuitPropertiesServiceState = Object.freeze(
  _defaultState
);
