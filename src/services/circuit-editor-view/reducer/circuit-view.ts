import { isViewCircuitAction } from "@/actions/circuit-view";
import { circuitIdsSelector } from "@/services/circuits/selectors/circuits";

import { createCircuitEditorViewReducer } from "../utils";

export default createCircuitEditorViewReducer((state, action, appState) => {
  if (!isViewCircuitAction(action)) {
    return state;
  }

  const { circuitId, circuitNodeIdPath } = action.payload;

  if (circuitIdsSelector(appState).indexOf(circuitId) === -1) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: circuitId,
    editingCircuitNodeIdPath: circuitNodeIdPath,
  };
});
