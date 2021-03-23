import { isCircuitEditorDragStartWireAction } from "@/actions/circuit-editor-drag-start-wire";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragStartWireAction(action)) {
    return state;
  }

  const { x, y, target, editorId, modifierKeys } = action.payload;

  return {
    dragMode: "wire",
    dragStartEditorId: editorId,
    dragStart: { x, y },
    dragStartTarget: target,
    dragModifierKeys: modifierKeys,
    dragEndEditorId: null,
    dragEnd: null,
  };
});
