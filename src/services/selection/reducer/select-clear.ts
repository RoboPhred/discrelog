import { isClearSelectionAction } from "@/actions/select-clear";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isClearSelectionAction(action)) {
    return state;
  }

  return {
    ...state,
    selectedNodeIds: [],
    selectedWireIds: [],
    selectedJointIds: []
  };
});
