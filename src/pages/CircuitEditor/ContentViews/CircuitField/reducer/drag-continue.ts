import { isDragContinueAction } from "../actions/drag-continue";

import { createFieldReducer } from "./utils";

export default createFieldReducer((state, action) => {
  if (!isDragContinueAction(action)) {
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
