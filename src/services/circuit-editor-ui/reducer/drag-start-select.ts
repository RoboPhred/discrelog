import { isFieldDragStartSelectAction } from "@/actions/field-drag-start-select";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
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
