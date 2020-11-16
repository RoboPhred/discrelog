import { isFieldDragStartNewNodeAction } from "@/actions/field-drag-start-newnode";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
  if (!isFieldDragStartNewNodeAction(action)) {
    return state;
  }

  const { nodeType } = action.payload;

  return {
    ...state,
    dragMode: "new-element" as const,
    dragNewElementType: nodeType,
  };
});
