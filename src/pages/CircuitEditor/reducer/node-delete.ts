import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDeleteNodeAction } from "@/services/simulator/actions/node-delete";

import { createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  return {
    ...state,
    nodePositions: pick(
      state.nodePositions,
      difference(Object.keys(state.nodePositions), nodeIds)
    ),
    selectedNodeIds: difference(state.selectedNodeIds, nodeIds),
    mouseOverNodeId:
      !state.mouseOverNodeId || nodeIds.indexOf(state.mouseOverNodeId) !== -1
        ? null
        : state.mouseOverNodeId
  };
});
