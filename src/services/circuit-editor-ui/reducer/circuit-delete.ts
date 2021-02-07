import { isDeleteCircuitAction } from "@/actions/circuit-delete";
import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  if (state.editingCircuitId !== circuitId) {
    return state;
  }

  return {
    ...state,
    editingCircuitId: "root",
  };
});
