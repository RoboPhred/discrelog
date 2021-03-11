import { SimulatorGraph } from "./types";

// FIXME: This whole service should just be a selector, but right now we need the entire root state
// to produce the sim graph.
export interface SimulatorGraphServiceState extends SimulatorGraph {
  // FIXME: This is a hack to let simStep selectively build the graph if its the first action.
  // It should be removed when this is a selector.
  initialized: boolean;
}

const _defaultState: SimulatorGraphServiceState = {
  initialized: false,
  simulatorNodesById: {},
  simulatorNodeIdsByCircuitNodeId: {},
};

export const defaultSimulatorGraphServiceState = Object.freeze(_defaultState);
