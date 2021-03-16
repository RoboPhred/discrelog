import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isFieldDragStartNodeAction } from "@/actions/field-drag-start-node";
import { selectNodes } from "@/actions/select-nodes";

import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";
import { circuitIdFromNodeIdSelector } from "@/services/circuits/selectors/nodes";

export default function dragStartNodeReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isFieldDragStartNodeAction(action)) {
    return state;
  }

  const { nodeId, x, y, modifierKeys } = action.payload;

  state = fpSet(state, "services", "circuitEditorUiDrag", (value) => ({
    ...value,
    dragMode: "move" as const,
    dragCircuitId: circuitIdFromNodeIdSelector(state, nodeId),
    dragStart: {
      x,
      y,
    },
  }));

  if (!isNodeSelectedFromNodeIdSelector(state, nodeId)) {
    const selectionMode = getSelectMode(modifierKeys);
    // Dragging a node that was not previously selected.  Perform a selection on the node.
    state = rootReducer(state, selectNodes(nodeId, selectionMode));
  }

  return state;
}