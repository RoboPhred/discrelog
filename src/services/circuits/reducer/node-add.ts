import { isAddNodeAction } from "@/actions/node-add";

import { editingCircuitIdSelector } from "@/services/circuit-editor-view/selectors/circuit";

import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action, rootState) => {
  if (!isAddNodeAction(action)) {
    return state;
  }

  const { nodeId, circuitId } = action.payload;

  const targetCircuitId = circuitId ?? editingCircuitIdSelector(rootState);

  return {
    ...state,
    nodeIdsByCircuitId: {
      ...state.nodeIdsByCircuitId,
      [targetCircuitId]: [...state.nodeIdsByCircuitId[targetCircuitId], nodeId],
    },
  };
});
