import { isCircuitEditorDragAbortAction } from "@/actions/circuit-editor-drag-abort";
import { defaultCircuitEditorDragServiceState } from "../state";
import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragAbortAction(action)) {
    return state;
  }

  return defaultCircuitEditorDragServiceState;
});
