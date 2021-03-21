import { isAddElementAction } from "@/actions/element-add";

import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isAddElementAction(action)) {
    return state;
  }

  const { elementId, circuitId } = action.payload;

  const targetCircuitId = circuitId;

  return {
    ...state,
    elementIdsByCircuitId: {
      ...state.elementIdsByCircuitId,
      [targetCircuitId]: [
        ...state.elementIdsByCircuitId[targetCircuitId],
        elementId,
      ],
    },
  };
});
