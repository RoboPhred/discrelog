import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCircuitEditorDragStartNodeAction } from "@/actions/circuit-editor-drag-start-node";
import { selectNodes } from "@/actions/select-nodes";

import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";
import { circuitIdFromNodeIdSelector } from "@/services/circuits/selectors/nodes";

export default function dragStartNodeReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isCircuitEditorDragStartNodeAction(action)) {
    return state;
  }

  const { nodeId, x, y, modifierKeys, editorId } = action.payload;

  const circuitId = circuitIdFromNodeIdSelector(state, nodeId);
  if (!circuitId) {
    return state;
  }

  state = fpSet(state, "services", "circuitEditorDrag", (value) => ({
    ...value,
    dragMode: "move" as const,
    dragStart: {
      x,
      y,
    },
    dragStartEditorId: editorId,
    dragModifierKeys: modifierKeys,
    dragEnd: null,
    dragEndEditorId: null,
  }));

  if (!isNodeSelectedFromNodeIdSelector(state, nodeId)) {
    const selectionMode = getSelectMode(modifierKeys);
    // Dragging a node that was not previously selected.  Perform a selection on the node.
    state = rootReducer(state, selectNodes(nodeId, selectionMode));
  }

  return state;
}
