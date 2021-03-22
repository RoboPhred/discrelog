import { isCircuitEditorDragStartWireAction } from "@/actions/circuit-editor-drag-start-wire";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragStartWireAction(action)) {
    return state;
  }

  const { x, y, pin, editorId } = action.payload;

  return {
    ...state,
    dragMode: "wire",
    dragStart: { x, y },
    dragStartEditorId: editorId,
    dragWireSource: pin,
    dragEnd: null,
    dragEndEditorId: null,
  };
});
