import { isCircuitEditorDragContinueAction } from "@/actions/circuit-editor-drag-continue";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
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
