import { AnyAction } from "redux";

import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { isMoveNodesAction } from "../actions/node-move";

export default function moveNodeReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction
) {
  if (!isMoveNodesAction(action)) {
    return state;
  }
  const { nodeIds, offsetX, offsetY } = action.payload;
  return {
    ...state,
    nodePositions: {
      ...state.nodePositions,
      ...mapValues(pick(state.nodePositions, nodeIds), p => ({
        x: p.x + offsetX,
        y: p.y + offsetY
      }))
    }
  };
}
