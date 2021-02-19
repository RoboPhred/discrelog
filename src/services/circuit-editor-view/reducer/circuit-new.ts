import { isAddCircuitAction } from "@/actions/circuit-add";

import { createCircuitEditorViewReducer } from "../utils";

export default createCircuitEditorViewReducer((state, action) => {
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
