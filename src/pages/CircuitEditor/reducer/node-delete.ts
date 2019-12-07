import { AnyAction } from "redux";
import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDeleteNodeAction } from "@/services/simulator/actions/node-delete";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";

export default function nodeDeleteReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction
) {
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
}
