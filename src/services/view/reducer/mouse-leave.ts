import { isFieldMouseLeaveAction } from "@/actions/field-mouse-leave";

import { createViewReducer } from "../utils";

export default createViewReducer((state, action) => {
  if (!isFieldMouseLeaveAction(action)) {
    return state;
  }

  if (state.dragMode == null) {
    return state;
  }

  return {
    ...state,
    dragEnd: null,
  };
});
