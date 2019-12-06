import produce from "immer";

import pull from "lodash/pull";

import { DeleteNodeAction } from "@/services/simulator/actions";
import { CircuitEditorState } from "@/pages/CircuitEditor/state";

export default produce(
  (state: CircuitEditorState, action: DeleteNodeAction) => {
    const { nodeIds } = action.payload;

    for (const nodeId of nodeIds) {
      delete state.nodePositions[nodeId];
    }

    pull(state.selectedNodeIds, ...nodeIds);

    if (
      state.mouseOverNodeId &&
      nodeIds.indexOf(state.mouseOverNodeId) !== -1
    ) {
      state.mouseOverNodeId = null;
    }
  }
);
