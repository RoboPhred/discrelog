import { isFieldDragStartSelectAction } from "@/actions/field-drag-start-select";

import { createViewReducer } from "../utils";

export default createViewReducer((state, action) => {
  if (!isFieldDragStartSelectAction(action)) {
    return state;
  }

  const { x, y } = action.payload;

  return {
    ...state,
    dragMode: "select",
    dragStart: {
      x,
      y,
    },
  };
});
