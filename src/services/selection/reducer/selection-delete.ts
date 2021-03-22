import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isDeleteSelectionAction } from "@/actions/selection-delete";
import { deleteElement } from "@/actions/element-delete";
import { detatchConnection } from "@/actions/connection-detatch";
import { deleteConnectionJoint } from "@/actions/connection-joint-delete";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isDeleteSelectionAction(action)) {
    return state;
  }

  const {
    selectedElementIds: selectedElementIds,
    selectedConnectionIds,
    selectedJointIds,
  } = state.services.selection;

  if (selectedElementIds.length > 0) {
    state = rootReducer(state, deleteElement(selectedElementIds));
  }
  state = selectedConnectionIds.reduce(
    (state, connectionId) =>
      rootReducer(state, detatchConnection(connectionId)),
    state
  );
  state = selectedJointIds.reduce(
    (state, jointId) => rootReducer(state, deleteConnectionJoint(jointId)),
    state
  );

  return state;
}
