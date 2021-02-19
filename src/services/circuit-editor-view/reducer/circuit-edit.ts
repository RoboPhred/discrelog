import { isEditCircuitAction } from "@/actions/circuit-edit";

import { createCircuitEditorViewReducer } from "../utils";

export default createCircuitEditorViewReducer((state, action) => {
  if (!isEditCircuitAction(action)) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: action.payload.circuitId,
  };
});
