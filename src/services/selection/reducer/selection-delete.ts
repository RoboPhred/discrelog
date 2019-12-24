import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isSelectionDeleteAction } from "@/actions/selection-delete";
import { deleteNode } from "@/actions/node-delete";

import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionDeleteAction(action)) {
    return state;
  }

  const selectedNodes = selectedNodeIdsSelector(state);
  if (selectedNodes.length === 0) {
    return state;
  }

  return rootReducer(state, deleteNode(selectedNodes));
}
