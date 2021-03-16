import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isFieldDragStartJointAction } from "@/actions/field-drag-start-joint";
import { selectWireJoints } from "@/actions/select-wire-joints";

import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";
import { circuitIdFromJointIdSelector } from "@/services/circuits/selectors/joints";

export default function dragStartJointReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isFieldDragStartJointAction(action)) {
    return state;
  }

  const { jointId, x, y, modifierKeys } = action.payload;

  const circuitId = circuitIdFromJointIdSelector(state, jointId);
  if (!circuitId) {
    return state;
  }

  state = fpSet(state, "services", "circuitEditorDrag", (value) => ({
    ...value,
    dragMode: "move" as const,
    dragCircuitId: circuitId,
    dragStart: {
      x,
      y,
    },
    dragModifierKeys: modifierKeys,
    dragEnd: null,
  }));

  if (!isJointSelectedFromJointIdSelector(state, jointId)) {
    const selectionMode = getSelectMode(modifierKeys);
    // Dragging a node that was not previously selected.  Perform a selection on the node.
    state = rootReducer(state, selectWireJoints(jointId, selectionMode));
  }

  return state;
}
