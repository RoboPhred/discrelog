import { isSelectNodesAction } from "@/actions/select-nodes";

import { combineSelection, createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectNodesAction(action)) {
    return state;
  }

  const { nodeIds, mode } = action.payload;

  return {
    ...state,
    selectedNodeIds: combineSelection(state.selectedNodeIds, nodeIds, mode),
    selectedWireIds: mode === "set" ? [] : state.selectedWireIds,
    selectedJointIds: mode === "set" ? [] : state.selectedJointIds
  };
});
