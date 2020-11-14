import { isFieldDragStartSelectAction } from "@/actions/field-drag-start-select";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
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
