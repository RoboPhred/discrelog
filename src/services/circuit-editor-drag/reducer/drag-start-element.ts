import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCircuitEditorDragStartElementAction } from "@/actions/circuit-editor-drag-start-element";
import { selectElements } from "@/actions/select-elements";

import { isElementSelectedFromElementIdSelector } from "@/services/selection/selectors/selection";
import { circuitIdFromElementIdSelector } from "@/services/circuits/selectors/elements";

export default function dragStartNodeReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isCircuitEditorDragStartElementAction(action)) {
    return state;
  }

  const { elementId, x, y, modifierKeys, editorId } = action.payload;

  const circuitId = circuitIdFromElementIdSelector(state, elementId);
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

  if (!isElementSelectedFromElementIdSelector(state, elementId)) {
    const selectionMode = getSelectMode(modifierKeys);
    // Dragging a node that was not previously selected.  Perform a selection on the node.
    state = rootReducer(state, selectElements(elementId, selectionMode));
  }

  return state;
}
