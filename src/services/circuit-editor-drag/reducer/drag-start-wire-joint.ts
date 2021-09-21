import { AnyAction } from "redux";

import { getSelectMode } from "@/selection-mode";
import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";

import { isCircuitEditorDragStartWireJointAction } from "@/actions/circuit-editor-drag-start-wire-joint";
import { selectWireJoints } from "@/actions/select-wire-joints";

export default (state: AppState = defaultAppState, action: AnyAction) => {
  if (!isCircuitEditorDragStartWireJointAction(action)) {
    return state;
  }

  const { x, y, editorId, wireId, jointId, modifierKeys } = action.payload;

  if (modifierKeys.ctrlMetaKey) {
    state = fpSet(state, "services", "circuitEditorDrag", () => ({
      dragMode: "wire" as const,
      dragStart: { x, y },
      dragStartEditorId: editorId,
      dragStartTarget: {
        type: "joint" as const,
        wireId,
        jointId,
      },
      dragModifierKeys: modifierKeys,
      dragEnd: null,
      dragEndEditorId: null,
    }));
  } else {
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
      state = rootReducer(state, selectWireJoints(jointId, selectionMode));
    }
  }

  return state;
};
