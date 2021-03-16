import { isFieldDragStartSelectAction } from "@/actions/field-drag-start-select";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
  if (!isFieldDragStartSelectAction(action)) {
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
