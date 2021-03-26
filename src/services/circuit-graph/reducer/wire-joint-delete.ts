import { isWireJointDeleteAction } from "@/actions/wire-joint-delete";

import { createCircuitGraphReducer } from "../utils";

import wireJointDelete from "./operations/wire-joint-delete";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireJointDeleteAction(action)) {
    return state;
  }

  const { jointIds } = action.payload;

  state = jointIds.reduce(
    (state, jointId) => wireJointDelete(state, jointId),
    state
  );

  return state;
});
