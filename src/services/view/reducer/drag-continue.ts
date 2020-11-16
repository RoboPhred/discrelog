import { isFieldDragContinueAction } from "@/actions/field-drag-continue";

import { createViewReducer } from "../utils";

export default createViewReducer((state, action) => {
  if (!isFieldDragContinueAction(action)) {
    return state;
  }

  const { x, y } = action.payload;

  return {
    ...state,
    dragEnd: {
      x,
      y,
    },
  };
});
