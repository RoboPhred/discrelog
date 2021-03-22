import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveConnectionJointAction } from "@/actions/connection-joint-move";

import { createCircuitLayoutReducer } from "../utils";
import {
  applyGridJointSnapSelector,
  applyGridElementSnapSelector,
} from "@/services/circuit-editor-drag/selectors/snap";

export default createCircuitLayoutReducer((state, action, appState) => {
  if (!isMoveConnectionJointAction(action)) {
    return state;
  }

  const { jointIds, position, relative, snapMode } = action.payload;

  const movedJoints = mapValues(
    pick(state.connectionJointPositionsByJointId, jointIds),
    (p) => {
      let movedP = {
        x: relative ? p.x + position.x : position.x,
        y: relative ? p.y + position.y : position.y,
      };

      if (snapMode === "element") {
        movedP = applyGridElementSnapSelector(appState, movedP);
      } else if (snapMode === "joint") {
        movedP = applyGridJointSnapSelector(appState, movedP);
      }

      return movedP;
    }
  );

  return {
    ...state,
    connectionJointPositionsByJointId: {
      ...state.connectionJointPositionsByJointId,
      ...movedJoints,
    },
  };
});
