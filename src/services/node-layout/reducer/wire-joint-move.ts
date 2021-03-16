import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveWireJointAction } from "@/actions/wire-joint-move";

import { createNodeLayoutReducer } from "../utils";
import {
  applyGridJointSnapSelector,
  applyGridNodeSnapSelector,
} from "@/services/circuit-editor-drag/selectors/snap";

export default createNodeLayoutReducer((state, action, appState) => {
  if (!isMoveWireJointAction(action)) {
    return state;
  }

  const { jointIds, position, relative, snapMode } = action.payload;

  const movedJoints = mapValues(
    pick(state.wireJointPositionsByJointId, jointIds),
    (p) => {
      let movedP = {
        x: relative ? p.x + position.x : position.x,
        y: relative ? p.y + position.y : position.y,
      };

      if (snapMode === "node") {
        movedP = applyGridNodeSnapSelector(appState, movedP);
      } else if (snapMode === "joint") {
        movedP = applyGridJointSnapSelector(appState, movedP);
      }

      return movedP;
    }
  );

  return {
    ...state,
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      ...movedJoints,
    },
  };
});
