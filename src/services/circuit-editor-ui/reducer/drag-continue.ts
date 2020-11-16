import { isFieldDragContinueAction } from "@/actions/field-drag-continue";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isFieldDragContinueAction(action)) {
    return state;
  }

  return {
    ...state,
    dragEnd: action.payload,
  };
});
