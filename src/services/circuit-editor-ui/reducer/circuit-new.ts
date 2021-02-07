import { isAddCircuitAction } from "@/actions/circuit-add";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isAddCircuitAction(action)) {
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
