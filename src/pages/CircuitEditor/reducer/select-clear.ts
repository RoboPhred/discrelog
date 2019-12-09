import { isClearSelectionAction } from "../actions/select-clear";

import { createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
  if (!isClearSelectionAction(action)) {
    return state;
  }

  return {
    ...state,
    selectedNodeIds: []
  };
});
