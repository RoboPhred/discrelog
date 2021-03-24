import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isWireJointMoveAction } from "@/actions/wire-joint-move";

import {
  applyGridElementSnapSelector,
  applyGridJointSnapSelector,
} from "@/services/circuit-editor-drag/selectors/snap";

import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action, appState) => {
  if (!isWireJointMoveAction(action)) {
    return state;
  }

  const { jointIds, position, relative, snapMode } = action.payload;

  const movedJointPositions = mapValues(
    pick(state.wireJointPositionsByJointId, jointIds),
    (p) => {
      let movedP = {
        x: relative ? p.x + position.x : position.x,
        y: relative ? p.y + position.y : position.y,
      };
      switch (snapMode) {
        case "element":
          movedP = applyGridElementSnapSelector(appState, movedP);
          break;
        case "joint":
          movedP = applyGridJointSnapSelector(appState, movedP);
          break;
      }
      return movedP;
    }
  );

  return {
    ...state,
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      ...movedJointPositions,
    },
  };
});
