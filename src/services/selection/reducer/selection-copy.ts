import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCopySelectionAction } from "@/actions/selection-copy";
import { copyElements } from "@/actions/clipboard-copy-elements";

import { selectedElementIdsSelector } from "@/services/selection/selectors/selection";

export default function selectionCopyReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isCopySelectionAction(action)) {
    return state;
  }

  const selectedElements = selectedElementIdsSelector(state);
  if (selectedElements.length === 0) {
    return state;
  }

  return rootReducer(state, copyElements(selectedElements));
}
