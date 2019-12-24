import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveNodesAction } from "@/actions/node-move";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isMoveNodesAction(action)) {
    return state;
  }
  const { nodeIds, offsetX, offsetY } = action.payload;
  if (nodeIds.length === 0) {
    return state;
  }

  const movedPositions = mapValues(
    pick(state.nodePositionsById, nodeIds),
    p => ({
      x: p.x + offsetX,
      y: p.y + offsetY
    })
  );

  return {
    ...state,
    nodePositionsById: {
      ...state.nodePositionsById,
      ...movedPositions
    }
  };
});
