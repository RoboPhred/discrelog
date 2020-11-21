import { isFieldDragStartWireAction } from "@/actions/field-drag-start-wire";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isFieldDragStartWireAction(action)) {
    return state;
  }

  const { dragStart, pin } = action.payload;

  return {
    ...state,
    dragMode: "wire",
    dragStart,
    dragWireSource: pin,
  };
});
