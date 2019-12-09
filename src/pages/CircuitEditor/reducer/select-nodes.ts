import { isSelectNodesAction } from "../actions/select-nodes";

import { combineSelection, createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
  if (!isSelectNodesAction(action)) {
    return state;
  }

  const { nodeIds, mode } = action.payload;

  return {
    ...state,
    selectedNodeIds: combineSelection(state.selectedNodeIds, nodeIds, mode)
  };
});
