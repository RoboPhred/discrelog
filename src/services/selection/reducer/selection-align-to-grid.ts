import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";
import { pointEquals } from "@/geometry";

import { isSelectionAlignToGridAction } from "@/actions/selection-align-to-grid";
import { moveElement } from "@/actions/element-move";
import { moveWireJoint } from "@/actions/wire-joint-move";

import { elementPositionsByElementIdSelector } from "@/services/element-layout/selectors/element-positions";
import {
  applyGridJointSnapSelector,
  applyGridElementSnapSelector,
} from "@/services/circuit-editor-drag/selectors/snap";
import { wireJointPositionsByJointIdSelector } from "@/services/element-layout/selectors/wires";

export default function selectionAlignToGridReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionAlignToGridAction(action)) {
    return state;
  }

  const {
    selectedElementIds: selectedElementIds,
    selectedJointIds,
  } = state.services.selection;

  // Align elements.
  const elementPositions = elementPositionsByElementIdSelector(state);
  for (const elementId of selectedElementIds) {
    const elementPos = elementPositions[elementId];
    if (!elementPos) {
      continue;
    }

    const snappedPos = applyGridElementSnapSelector(state, elementPos);
    if (!pointEquals(elementPos, snappedPos)) {
      state = rootReducer(state, moveElement(elementId, snappedPos));
    }
  }

  // Align joints.
  const jointPositions = wireJointPositionsByJointIdSelector(state);
  for (const jointId of selectedJointIds) {
    const jointPos = jointPositions[jointId];
    if (!jointPos) {
      continue;
    }

    const snappedPos = applyGridJointSnapSelector(state, jointPos);
    if (!pointEquals(jointPos, snappedPos)) {
      state = rootReducer(state, moveWireJoint(jointId, snappedPos));
    }
  }

  return state;
}
