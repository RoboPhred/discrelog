import { isWireJointDeleteAction } from "@/actions/wire-joint-delete";
import { wireIdFromWireJointIdSelector } from "../selectors/wires";

import { createCircuitGraphReducer } from "../utils";

import wireJointDelete from "./operations/wire-joint-delete";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireJointDeleteAction(action)) {
    return state;
  }

  const { jointIds } = action.payload;

  state = jointIds.reduce((state, jointId) => {
    const wireId = wireIdFromWireJointIdSelector.local(state, jointId);
    if (!wireId) {
      return state;
    }
    return wireJointDelete(state, wireId, jointId);
  }, state);

  return state;
});
