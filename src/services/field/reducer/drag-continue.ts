import { isFieldDragContinueAction } from "@/actions/field-drag-continue";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isFieldDragContinueAction(action)) {
    return state;
  }

  const { x, y } = action.payload;

  return {
    ...state,
    dragEnd: {
      x,
      y
    }
  };
});
