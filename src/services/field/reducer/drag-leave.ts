import { isFieldDragLeaveAction } from "@/actions/field-drag-leave";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isFieldDragLeaveAction(action)) {
    return state;
  }

  return {
    ...state,
    dragEnd: null
  };
});
