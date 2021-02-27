import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveNodeAction } from "@/actions/node-move";

import { applyGridNodeSnapSelector } from "@/services/circuit-editor-ui-drag/selectors/snap";

import { createNodeLayoutReducer } from "../utils";

export default createNodeLayoutReducer((state, action, appState) => {
  if (!isMoveNodeAction(action)) {
    return state;
  }

  const { nodeIds, position, relative, snapMode } = action.payload;

  const movedNodePositions = mapValues(
    pick(state.nodePositionsById, nodeIds),
    (p) => {
      let movedP = {
        x: relative ? p.x + position.x : position.x,
        y: relative ? p.y + position.y : position.y,
      };
      if (snapMode === "node") {
        movedP = applyGridNodeSnapSelector(appState, movedP);
      }
      return movedP;
    }
  );

  return {
    ...state,
    nodePositionsById: {
      ...state.nodePositionsById,
      ...movedNodePositions,
    },
  };
});
