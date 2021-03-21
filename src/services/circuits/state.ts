import { ROOT_CIRCUIT_ID } from "./constants";

export interface CircuitsServiceState {
  /**
   * The user-provided names for circuits by circuit id.
   */
  circuitNamesByCircuitId: Record<string, string>;

  /**
   * Arrays of node ids contained in a circuit by the containing circuit id.
   */
  elementIdsByCircuitId: Record<string, string[]>;
}

const _defaultState: CircuitsServiceState = {
  circuitNamesByCircuitId: {
    [ROOT_CIRCUIT_ID]: "Root",
  },
  elementIdsByCircuitId: {
    [ROOT_CIRCUIT_ID]: [],
  },
};

export const defaultCircuitsServiceState = Object.freeze(_defaultState);
