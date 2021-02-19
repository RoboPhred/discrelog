import { SimulatorNode } from "./types";

export interface SimulatorGraphServiceState {
  /**
   * A map of all simulator nodes by simulator node id.
   */
  simulatorNodesById: Record<string, SimulatorNode>;

  /**
   * A map of simulator node ids by the circuit node id that generated them.
   */
  simulatorNodeIdsByCircuitNodeId: Record<string, string>;
}

const _defaultState: SimulatorGraphServiceState = {
  simulatorNodesById: {},
  simulatorNodeIdsByCircuitNodeId: {},
};

export const defaultSimulatorGraphServiceState = Object.freeze(_defaultState);
