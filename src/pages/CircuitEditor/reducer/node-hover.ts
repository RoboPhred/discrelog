import { AnyAction } from "redux";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { isHoverNodeAction } from "../actions/node-hover";

export default function nodeHoverReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction
): CircuitEditorState {
  if (!isHoverNodeAction(action)) {
    return state;
  }

  const { nodeId } = action.payload;
  return {
    ...state,
    mouseOverNodeId: nodeId
  };
}
