import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { createCircuitEditorViewReducer } from "../utils";

export default createCircuitEditorViewReducer((state, action) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  if (state.editingCircuitId !== circuitId) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: ROOT_CIRCUIT_ID,
  };
});
