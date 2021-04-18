import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isDeleteSelectionAction } from "@/actions/selection-delete";
import { deleteElement } from "@/actions/element-delete";
import { deleteWireJoint } from "@/actions/wire-joint-delete";
import { deleteWireSegment } from "@/actions/wire-segment-delete";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isDeleteSelectionAction(action)) {
    return state;
  }

  const {
    selectedElementIds,
    selectedWireJointIds,
    selectedWireSegmentIds,
  } = state.services.selection;

  if (selectedElementIds.length > 0) {
    state = rootReducer(state, deleteElement(selectedElementIds));
  }

  if (selectedWireJointIds.length > 0) {
    state = rootReducer(state, deleteWireJoint(selectedWireJointIds));
  }

  if (selectedWireSegmentIds.length > 0) {
    state = rootReducer(state, deleteWireSegment(selectedWireSegmentIds));
  }

  return state;
}
