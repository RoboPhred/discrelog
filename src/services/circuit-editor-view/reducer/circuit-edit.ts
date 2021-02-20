import { isEditCircuitAction } from "@/actions/circuit-edit";
import { circuitIdsSelector } from "@/services/circuits/selectors/circuits";

import { createCircuitEditorViewReducer } from "../utils";

export default createCircuitEditorViewReducer((state, action, appState) => {
  if (!isEditCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  // Click of "Delete Circuit" menu item is making its way back
  // to the item in the circuit list, triggering an edit action.
  // Should be fixed in UI, but blocking it here for now.
  if (circuitIdsSelector(appState).indexOf(circuitId) === -1) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: circuitId,
  };
});
