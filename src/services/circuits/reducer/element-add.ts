import { isAddElementAction } from "@/actions/element-add";
import { editingCircuitIdSelector } from "@/services/circuit-editor-ui/selectors/circuit";

import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action, rootState) => {
  if (!isAddElementAction(action)) {
    return state;
  }

  const { nodeId, circuitId } = action.payload;

  const targetCircuitId = circuitId ?? editingCircuitIdSelector(rootState);

  return {
    ...state,
    nodeIdsByCircuitId: {
      [targetCircuitId]: [...state.nodeIdsByCircuitId[targetCircuitId], nodeId],
    },
  };
});
