import { isFieldDragStartWireAction } from "@/actions/field-drag-start-wire";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
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
