import { AnyAction } from "redux";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { isClearSelectionAction } from "../actions/select-clear";

export default function clearSelectionReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction
): CircuitEditorState {
  if (!isClearSelectionAction(action)) {
    return state;
  }

  return {
    ...state,
    selectedNodeIds: []
  };
}
