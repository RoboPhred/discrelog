import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCircuitEditorDragStartConnectionJointAction } from "@/actions/circuit-editor-drag-start-connection-joint";
import { selectConnectionJoints } from "@/actions/select-connection-joints";

import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";

export default function dragStartJointReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isCircuitEditorDragStartConnectionJointAction(action)) {
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
    state = rootReducer(state, selectConnectionJoints(jointId, selectionMode));
  }

  return state;
}
