import { isAddCircuitAction } from "@/actions/circuit-add";
import { createCircuitPropertiesReducer } from "../utils";

export default createCircuitPropertiesReducer((state, action) => {
  if (!isAddCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;
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
  };
});
