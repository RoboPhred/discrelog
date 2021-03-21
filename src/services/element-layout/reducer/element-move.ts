import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveElementAction } from "@/actions/element-move";

import { applyGridElementSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";

import { createElementLayoutReducer } from "../utils";

export default createElementLayoutReducer((state, action, appState) => {
  if (!isMoveElementAction(action)) {
    return state;
  }

  const { elementIds, position, relative, snapMode } = action.payload;

  const movedElementPositions = mapValues(
    pick(state.elementPositionsById, elementIds),
    (p) => {
      let movedP = {
        x: relative ? p.x + position.x : position.x,
        y: relative ? p.y + position.y : position.y,
      };
      if (snapMode === "element") {
        movedP = applyGridElementSnapSelector(appState, movedP);
      }
      return movedP;
    }
  );

  return {
    ...state,
    elementPositionsById: {
      ...state.elementPositionsById,
      ...movedElementPositions,
    },
  };
});
