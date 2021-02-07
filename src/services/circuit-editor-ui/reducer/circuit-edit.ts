import { isEditCircuitAction } from "@/actions/circuit-edit";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isEditCircuitAction(action)) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: action.payload.circuitId,
  };
});
