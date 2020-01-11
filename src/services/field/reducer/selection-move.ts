import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveSelectionAction } from "@/actions/selection-move";
import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action, appState) => {
  if (!isMoveSelectionAction(action)) {
    return state;
  }

  const nodeIds = selectedNodeIdsSelector(appState);
  const { offsetX, offsetY } = action.payload;

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
