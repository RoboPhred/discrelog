import { PRIORITY_PRE, reducerPriority } from "@/store/priorities";

import { isStepSimAction } from "@/actions/sim-step";

import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { createSimulatorGraphReducer } from "../utils";
import { produceCircuitGraph } from "../graph-production";

// This must run before simulator/reducer/sim-start, as we need to build up the graph before it can
// run the first tick.
export default reducerPriority(
  PRIORITY_PRE,
  createSimulatorGraphReducer((state, action, rootState) => {
    if (!isStepSimAction(action)) {
      return state;
    }

    if (state.initialized) {
      // Might have initialized previously.
      return state;
    }

    const {
      simulatorNodesById,
      simulatorNodeIdsByCircuitNodeId,
    } = produceCircuitGraph(ROOT_CIRCUIT_ID, rootState);

    return {
      ...state,
      initialized: true,
      simulatorNodesById,
      simulatorNodeIdsByCircuitNodeId,
    };
  })
);
