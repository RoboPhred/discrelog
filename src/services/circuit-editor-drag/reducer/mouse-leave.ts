import { isCircuitEditorMouseLeaveAction } from "@/actions/circuit-editor-mouse-leave";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
  if (!isCircuitEditorMouseLeaveAction(action)) {
    return state;
  }

  if (state.dragMode == null) {
    return state;
  }

  return {
    ...state,
    dragEnd: null,
  };
});
