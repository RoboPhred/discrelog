import { isFieldDragContinueAction } from "@/actions/field-drag-continue";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
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
