import { isFieldMouseLeaveAction } from "@/actions/field-mouse-leave";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
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
