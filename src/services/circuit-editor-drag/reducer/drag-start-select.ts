import { isCircuitEditorDragStartSelectAction } from "@/actions/circuit-editor-drag-start-select";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragStartSelectAction(action)) {
    return state;
  }

  const { x, y, modifierKeys, editorId } = action.payload;

  return {
    ...state,
    dragMode: "select",
    dragStart: {
      x,
      y,
    },
    dragStartEditorId: editorId,
    dragModifierKeys: modifierKeys,
    dragEnd: null,
    dragEndEditorId: null,
  };
});
