import { ROOT_CIRCUIT_ID } from "./constants";

export interface CircuitsState {
  /**
   * The user-provided names for circuits by circuit id.
   */
  circuitNamesByCircuitId: Record<string, string>;

  /**
   * Arrays of node ids contained in a circuit by the containing circuit id.
   */
  nodeIdsByCircuitId: Record<string, string[]>;
}

const _defaultState: CircuitsState = {
  circuitNamesByCircuitId: {
    [ROOT_CIRCUIT_ID]: "Root",
  },
  nodeIdsByCircuitId: {
    [ROOT_CIRCUIT_ID]: [],
  },
};

export const defaultCircuitsState = Object.freeze(_defaultState);
