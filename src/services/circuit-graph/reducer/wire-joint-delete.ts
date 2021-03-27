import { isWireJointDeleteAction } from "@/actions/wire-joint-delete";

import { createCircuitGraphReducer } from "../utils";

import { wireJointMergeOrDelete } from "./operations/wire-joint-merge-or-delete";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireJointDeleteAction(action)) {
    return state;
  }

  const { jointIds } = action.payload;

  state = jointIds.reduce(
    (state, jointId) => wireJointMergeOrDelete(state, jointId),
    state
  );

  return state;
});
