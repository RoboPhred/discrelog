import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { copyNodes } from "../actions/clipboard-copy";
import { isSelectionCopyAction } from "../actions/selection-copy";
import { selectedNodeIdsSelector } from "../selectors";

export default function selectionCopyReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionCopyAction(action)) {
    return state;
  }

  const selectedNodes = selectedNodeIdsSelector(state);
  if (selectedNodes.length === 0) {
    return state;
  }

  return rootReducer(state, copyNodes(selectedNodes));
}
