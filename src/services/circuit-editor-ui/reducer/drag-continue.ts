import { isFieldDragContinueAction } from "@/actions/field-drag-continue";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isFieldDragContinueAction(action)) {
    return state;
  }

  const { dragPos, modifierKeys } = action.payload;

  return {
    ...state,
    dragEnd: dragPos,
    dragModifierKeys: modifierKeys,
  };
});
