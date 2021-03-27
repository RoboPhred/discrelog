import { isWireJointDeleteAction } from "@/actions/wire-joint-delete";

import { createCircuitGraphReducer } from "../utils";
import { WireOperationError } from "./errors/WireOperationError";

import { wireJointMergeOrDelete } from "./operations/wire-joint-merge-or-delete";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireJointDeleteAction(action)) {
    return state;
  }

  const { jointIds } = action.payload;

  state = jointIds.reduce((state, jointId) => {
    try {
      return wireJointMergeOrDelete(state, jointId);
    } catch (e) {
      if (e instanceof WireOperationError === false) {
        throw e;
      }
      return state;
    }
  }, state);

  return state;
});
