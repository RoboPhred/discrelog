import { isRenameCircuitAction } from "@/actions/circuit-rename";
import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isRenameCircuitAction(action)) {
    return state;
  }

  const { circuitId, circuitName } = action.payload;

  let trimmedName = circuitName.trim();

  if (trimmedName === "") {
    return state;
  }

  return {
    ...state,
    circuitNamesByCircuitId: {
      ...state.circuitNamesByCircuitId,
      [circuitId]: trimmedName,
    },
  };
});
