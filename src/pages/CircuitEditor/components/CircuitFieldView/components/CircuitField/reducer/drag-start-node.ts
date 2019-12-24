import { AnyAction } from "redux";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { selectNodes } from "@/actions/select-nodes";

import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";

import { isDragStartNodeAction } from "../actions/drag-start-node";

export default function dragNodesStartReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isDragStartNodeAction(action)) {
    return state;
  }

  const { nodeId, x, y, selectionMode } = action.payload;

  let fieldState = state.ui.circuitEditor.circuitField;
  fieldState = {
    ...fieldState,
    dragMode: "move-node",
    dragStart: {
      x,
      y
    }
  };
  state = fpSet(state, "ui", "circuitEditor", "circuitField", fieldState);

  // TODO: Use selector for this.
  if (selectedNodeIdsSelector(state).indexOf(nodeId) === -1) {
    // Dragging a node that was not previously selected.  Perform a selection on the node.
    state = rootReducer(state, selectNodes(nodeId, selectionMode));
  }

  return state;
}
