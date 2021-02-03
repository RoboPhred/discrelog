import { isNewCircuitAction } from "@/actions/circuit-new";
import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isNewCircuitAction(action)) {
    return state;
  }

  let { circuitId, circuitName } = action.payload;

  if (!circuitName) {
    circuitName = `Circuit ${
      Object.keys(state.circuitNamesByCircuitId).length + 1
    }`;
  }

  return {
    ...state,
    circuitNamesByCircuitId: {
      ...state.circuitNamesByCircuitId,
      [circuitId]: circuitName,
    },
    nodeIdsByCircuitId: {
      ...state.nodeIdsByCircuitId,
      [circuitId]: [],
    },
  };
});
