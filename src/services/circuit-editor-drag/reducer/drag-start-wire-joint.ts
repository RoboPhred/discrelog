import { AnyAction } from "redux";

import { getSelectMode } from "@/selection-mode";
import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";

import { isCircuitEditorDragStartWireJointAction } from "@/actions/circuit-editor-drag-start-wire-joint";
import { selectJoints } from "@/actions/select-joints";

export default (state: AppState = defaultAppState, action: AnyAction) => {
  if (!isCircuitEditorDragStartWireJointAction(action)) {
    return state;
  }

  const { x, y, editorId, jointId, modifierKeys } = action.payload;

  state = fpSet(state, "services", "circuitEditorDrag", () => ({
    dragMode: "move" as const,
    dragStart: { x, y },
    dragStartEditorId: editorId,
    dragModifierKeys: modifierKeys,
    dragEnd: null,
    dragEndEditorId: null,
  }));

  if (!isJointSelectedFromJointIdSelector(state, jointId)) {
    const selectionMode = getSelectMode(modifierKeys);
    // Dragging an element that was not previously selected.  Perform a selection on the element.
    state = rootReducer(state, selectJoints(jointId, selectionMode));
  }

  return state;
};
