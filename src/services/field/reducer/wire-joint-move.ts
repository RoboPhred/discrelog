import { fpSet } from "@/utils";
import { isMoveWireJointAction } from "@/actions/wire-joint-move";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isMoveWireJointAction(action)) {
    return state;
  }

  const { wireId, jointIndex, position } = action.payload;

  return fpSet(state, "wireJointsByWireId", wireId, jointIndex, position);
});
