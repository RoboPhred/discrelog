import { isFieldDragStartNewNodeAction } from "@/actions/field-drag-start-newnode";

import { createViewReducer } from "../utils";

export default createViewReducer((state, action) => {
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
