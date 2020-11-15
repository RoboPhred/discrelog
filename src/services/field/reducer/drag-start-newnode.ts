import { isFieldDragStartNewNodeAction } from "@/actions/field-drag-start-newnode";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
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
