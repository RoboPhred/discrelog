import { isRenameCircuitAction } from "@/actions/circuit-rename";
import { createCircuitPropertiesReducer } from "../utils";

export default createCircuitPropertiesReducer((state, action) => {
  if (!isRenameCircuitAction(action)) {
    return state;
  }

  const { circuitId, circuitName } = action.payload;

  const trimmedName = circuitName.trim();

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
