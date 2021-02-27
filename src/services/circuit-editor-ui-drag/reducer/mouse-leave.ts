import { isFieldMouseLeaveAction } from "@/actions/field-mouse-leave";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
  if (!isFieldMouseLeaveAction(action)) {
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
