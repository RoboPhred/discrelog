import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isDeleteSelectionAction } from "@/actions/selection-delete";
import { deleteElement } from "@/actions/element-delete";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isDeleteSelectionAction(action)) {
    return state;
  }

  const { selectedElementIds } = state.services.selection;

  if (selectedElementIds.length > 0) {
    state = rootReducer(state, deleteElement(selectedElementIds));
  }

  return state;
}
