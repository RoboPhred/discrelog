import { AnyAction } from "redux";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { isSelectNodesAction } from "../actions/select-nodes";

import { combineSelection } from "./utils";

export default function selectNodesReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction
): CircuitEditorState {
  if (!isSelectNodesAction(action)) {
    return state;
  }

  const { nodeIds, mode } = action.payload;

  return {
    ...state,
    selectedNodeIds: combineSelection(state.selectedNodeIds, nodeIds, mode)
  };
}
