import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCircuitEditorDragStartJointAction } from "@/actions/circuit-editor-drag-start-joint";
import { selectWireJoints } from "@/actions/select-wire-joints";

import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";

export default function dragStartJointReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isCircuitEditorDragStartJointAction(action)) {
    return state;
  }

  const { jointId, x, y, modifierKeys, editorId } = action.payload;

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

  if (!isJointSelectedFromJointIdSelector(state, jointId)) {
    const selectionMode = getSelectMode(modifierKeys);
    // Dragging an element that was not previously selected.  Perform a selection on the element.
    state = rootReducer(state, selectWireJoints(jointId, selectionMode));
  }

  return state;
}
