import { SimulatorNode } from "./types";

export interface SimulatorGraphState {
  /**
   * A map of all simulator nodes by simulator node id.
   */
  simulatorNodesById: Record<string, SimulatorNode>;

  /**
   * A map of simulator node ids by the circuit node id that generated them.
   */
  simulatorNodeIdsByCircuitNodeId: Record<string, string>;
}

const _defaultState: SimulatorGraphState = {
  simulatorNodesById: {},
  simulatorNodeIdsByCircuitNodeId: {},
};

export const defaultSimulatorGraphState = Object.freeze(_defaultState);
