import { combineSelection } from "@/selection-mode";

import { isSelectNodesAction } from "@/actions/select-nodes";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectNodesAction(action)) {
    return state;
  }

  const { nodeIds, mode } = action.payload;

  return {
    ...state,
    selectedNodeIds: combineSelection(state.selectedNodeIds, nodeIds, mode),
    selectedConnectionIds: mode === "set" ? [] : state.selectedConnectionIds,
    selectedJointIds: mode === "set" ? [] : state.selectedJointIds,
  };
});
