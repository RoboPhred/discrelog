import { isEditCircuitAction } from "@/actions/circuit-edit";
import { circuitIdsSelector } from "@/services/circuits/selectors/circuits";

import { createCircuitEditorViewReducer } from "../utils";

export default createCircuitEditorViewReducer((state, action, appState) => {
  if (!isEditCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  if (circuitIdsSelector(appState).indexOf(circuitId) === -1) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: circuitId,
  };
});
