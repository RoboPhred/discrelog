import difference from "lodash/difference";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  return {
    ...state,
    selectedNodeIds: difference(state.selectedNodeIds, nodeIds),
    selectedWireIds: [], // Might be removing a node attached to a selected wire
  };
});
