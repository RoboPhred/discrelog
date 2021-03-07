import { isFieldDragStartSelectAction } from "@/actions/field-drag-start-select";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
  if (!isFieldDragStartSelectAction(action)) {
    return state;
  }

  const { x, y } = action.payload;

  return {
    ...state,
    dragMode: "select",
    dragStart: {
      x,
      y,
    },
  };
});