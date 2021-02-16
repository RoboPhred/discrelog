import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCopySelectionAction } from "@/actions/selection-copy";
import { copyNodes } from "@/actions/clipboard-copy";

import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";

export default function selectionCopyReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isCopySelectionAction(action)) {
    return state;
  }

  const selectedNodes = selectedNodeIdsSelector(state);
  if (selectedNodes.length === 0) {
    return state;
  }

  return rootReducer(state, copyNodes(selectedNodes));
}
