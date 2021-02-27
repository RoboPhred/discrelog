import { isFieldDragStartNewNodeAction } from "@/actions/field-drag-start-newnode";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
  if (!isFieldDragStartNewNodeAction(action)) {
    return state;
  }

  const { nodeType } = action.payload;

  return {
    ...state,
    dragMode: "new-node" as const,
    dragNewNodeType: nodeType,
  };
});
