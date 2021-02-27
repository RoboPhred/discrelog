import { isAddCircuitAction } from "@/actions/circuit-add";

import { createCircuitEditorUiViewportReducer } from "../utils";

export default createCircuitEditorUiViewportReducer((state, action) => {
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
