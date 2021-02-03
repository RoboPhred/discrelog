import { isNewCircuitAction } from "@/actions/circuit-new";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isNewCircuitAction(action)) {
    return state;
  }

  const { circuitId, edit } = action.payload;

  if (!edit) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: circuitId,
  };
});
