import { isAddCircuitAction } from "@/actions/circuit-add";
import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isAddCircuitAction(action)) {
    return state;
  }

  const circuitId = action.payload.circuitId;
  let circuitName = action.payload.circuitName;

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
