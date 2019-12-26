import { isSelectNodesAction } from "@/actions/select-nodes";

import { combineSelection, createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectNodesAction(action)) {
    return state;
  }

  const { nodeIds, mode } = action.payload;

  return {
    ...state,
    selectionType: "nodes",
    selectedIds: combineSelection(state.selectedIds, nodeIds, mode)
  };
});
