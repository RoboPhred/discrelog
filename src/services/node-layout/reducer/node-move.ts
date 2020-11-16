import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveNodeAction } from "@/actions/node-move";
import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action, appState) => {
  if (!isMoveNodeAction(action)) {
    return state;
  }

  const { nodeIds, position, relative } = action.payload;

  const movedNodePositions = mapValues(
    pick(state.nodePositionsById, nodeIds),
    (p) => ({
      x: relative ? p.x + position.x : position.x,
      y: relative ? p.y + position.y : position.y,
    })
  );

  return {
    ...state,
    nodePositionsById: {
      ...state.nodePositionsById,
      ...movedNodePositions,
    },
  };
});
