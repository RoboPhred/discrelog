import { AnyAction } from "redux";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isFieldDragStartNodeAction } from "@/actions/field-drag-start-node";
import { selectNodes } from "@/actions/select-nodes";

import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";

export default function dragNodesStartReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isFieldDragStartNodeAction(action)) {
    return state;
  }

  const { nodeId, x, y, selectionMode } = action.payload;

  state = fpSet(state, "services", "circuitEditorUi", (value) => ({
    ...value,
    dragMode: "move" as const,
    dragStart: {
      x,
      y,
    },
  }));

  if (!isNodeSelectedFromNodeIdSelector(state, nodeId)) {
    // Dragging a node that was not previously selected.  Perform a selection on the node.
    state = rootReducer(state, selectNodes(nodeId, selectionMode));
  }

  return state;
}
