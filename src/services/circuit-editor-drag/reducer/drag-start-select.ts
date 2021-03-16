import { isCircuitEditorDragStartSelectAction } from "@/actions/circuit-editor-drag-start-select";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragStartSelectAction(action)) {
    return state;
  }

  const { x, y, modifierKeys, circuitId } = action.payload;

  return {
    ...state,
    dragMode: "select",
    dragCircuitId: circuitId,
    dragStart: {
      x,
      y,
    },
    dragModifierKeys: modifierKeys,
    dragEnd: null,
  };
});
