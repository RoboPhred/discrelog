import { isFieldMouseLeaveAction } from "@/actions/field-mouse-leave";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
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
