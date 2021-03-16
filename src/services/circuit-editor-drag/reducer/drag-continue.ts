import { isCircuitEditorDragContinueAction } from "@/actions/circuit-editor-drag-continue";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragContinueAction(action)) {
    return state;
  }

  const { dragPos, modifierKeys } = action.payload;

  return {
    ...state,
    dragEnd: dragPos,
    dragModifierKeys: modifierKeys,
  };
});
