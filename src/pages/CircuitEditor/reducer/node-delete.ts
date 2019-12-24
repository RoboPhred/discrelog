import difference from "lodash/difference";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  return {
    ...state,
    selectedNodeIds: difference(state.selectedNodeIds, nodeIds),
    mouseOverNodeId:
      !state.mouseOverNodeId || nodeIds.indexOf(state.mouseOverNodeId) !== -1
        ? null
        : state.mouseOverNodeId
  };
});
