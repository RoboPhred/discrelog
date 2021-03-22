import { isAddCircuitAction } from "@/actions/circuit-add";

import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isAddCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;
  return {
    ...state,
    elementIdsByCircuitId: {
      ...state.elementIdsByCircuitId,
      [circuitId]: [],
    },
  };
});
