import { fpSet } from "@/utils";
import { isMoveWireJointAction } from "@/actions/wire-joint-move";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isMoveWireJointAction(action)) {
    return state;
  }

  const { jointId, position } = action.payload;

  return fpSet(state, "wireJointPositionsByJointId", jointId, position);
});
