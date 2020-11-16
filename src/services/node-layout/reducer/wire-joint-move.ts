import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveWireJointAction } from "@/actions/wire-joint-move";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isMoveWireJointAction(action)) {
    return state;
  }

  const { jointIds, position, relative } = action.payload;

  const movedJoints = mapValues(
    pick(state.wireJointPositionsByJointId, jointIds),
    (p) => ({
      x: relative ? p.x + position.x : position.x,
      y: relative ? p.y + position.y : position.y,
    })
  );

  return {
    ...state,
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      ...movedJoints,
    },
  };
});
