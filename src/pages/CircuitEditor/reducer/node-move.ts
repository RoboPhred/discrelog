import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveNodesAction } from "../actions/node-move";

import { createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
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
});
