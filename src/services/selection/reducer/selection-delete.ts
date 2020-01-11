import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isSelectionDeleteAction } from "@/actions/selection-delete";
import { deleteNode } from "@/actions/node-delete";

import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";
import { detatchWire } from "@/actions/wire-detatch";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionDeleteAction(action)) {
    return state;
  }

  const { selectedNodeIds, selectedWireIds } = state.services.selection;

  state = rootReducer(state, deleteNode(selectedNodeIds));
  state = selectedWireIds.reduce(
    (state, wireId) => rootReducer(state, detatchWire(wireId)),
    state
  );

  return state;
}
