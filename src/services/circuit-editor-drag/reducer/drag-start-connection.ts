import { isCircuitEditorDragStartConnectionAction } from "@/actions/circuit-editor-drag-start-connection";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragStartConnectionAction(action)) {
    return state;
  }

  const { x, y, pin, editorId } = action.payload;

  return {
    ...state,
    dragMode: "connection",
    dragStart: { x, y },
    dragStartEditorId: editorId,
    dragPinSource: pin,
    dragEnd: null,
    dragEndEditorId: null,
  };
});
