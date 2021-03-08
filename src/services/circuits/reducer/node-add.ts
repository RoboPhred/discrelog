import { isAddNodeAction } from "@/actions/node-add";

import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isAddNodeAction(action)) {
    return state;
  }

  const { nodeId, circuitId } = action.payload;

  const targetCircuitId = circuitId;

  return {
    ...state,
    nodeIdsByCircuitId: {
      ...state.nodeIdsByCircuitId,
      [targetCircuitId]: [...state.nodeIdsByCircuitId[targetCircuitId], nodeId],
    },
  };
});
