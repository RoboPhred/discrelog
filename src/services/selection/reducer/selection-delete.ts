import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isDeleteSelectionAction } from "@/actions/selection-delete";
import { deleteNode } from "@/actions/node-delete";
import { detatchWire } from "@/actions/wire-detatch";
import { deleteWireJoint } from "@/actions/wire-joint-delete";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isDeleteSelectionAction(action)) {
    return state;
  }

  const {
    selectedNodeIds,
    selectedConnectionIds,
    selectedJointIds,
  } = state.services.selection;

  if (selectedNodeIds.length > 0) {
    state = rootReducer(state, deleteNode(selectedNodeIds));
  }
  state = selectedConnectionIds.reduce(
    (state, connectionId) => rootReducer(state, detatchWire(connectionId)),
    state
  );
  state = selectedJointIds.reduce(
    (state, jointId) => rootReducer(state, deleteWireJoint(jointId)),
    state
  );

  return state;
}
