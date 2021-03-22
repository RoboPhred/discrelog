import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCircuitEditorDragStartElementAction } from "@/actions/circuit-editor-drag-start-element";
import { selectElements } from "@/actions/select-elements";

import { isElementSelectedFromElementIdSelector } from "@/services/selection/selectors/selection";

export default function dragStartNodeReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isCircuitEditorDragStartElementAction(action)) {
    return state;
  }

  const { elementId, x, y, modifierKeys, editorId } = action.payload;

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
    // Dragging an element that was not previously selected.  Perform a selection on the element.
    state = rootReducer(state, selectElements(elementId, selectionMode));
  }

  return state;
}
