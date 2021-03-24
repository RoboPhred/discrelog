import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isDeleteSelectionAction } from "@/actions/selection-delete";
import { deleteElement } from "@/actions/element-delete";
import { deleteWireJoint } from "@/actions/wire-joint-delete";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isDeleteSelectionAction(action)) {
    return state;
  }

  const { selectedElementIds, selectedJointIds } = state.services.selection;

  if (selectedElementIds.length > 0) {
    state = rootReducer(state, deleteElement(selectedElementIds));
  }

  if (selectedJointIds.length > 0) {
    state = rootReducer(state, deleteWireJoint(selectedJointIds));
  }

  return state;
}
