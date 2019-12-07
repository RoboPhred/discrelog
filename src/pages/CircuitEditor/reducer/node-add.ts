import { AnyAction } from "redux";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { isAddNodeAction } from "../actions/node-add";

export default function addNodeReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction
) {
  if (!isAddNodeAction(action)) {
    return state;
  }
  const { nodeId: id, x = 0, y = 0 } = action.payload;
  return {
    ...state,
    nodePositions: {
      ...state.nodePositions,
      [id]: {
        x,
        y
      }
    }
  };
}
