import { isDragStartSelectAction } from "../actions/drag-start-select";

import { createFieldReducer } from "./utils";

export default createFieldReducer((state, action) => {
  if (!isDragStartSelectAction(action)) {
    return state;
  }

  const { x, y } = action.payload;

  return {
    ...state,
    dragMode: "select",
    dragStart: {
      x,
      y
    }
  };
});
