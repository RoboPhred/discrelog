import { isWireConnectJointToPinAction } from "@/actions/wire-connect-joint-to-pin";

import { createCircuitGraphReducer } from "../utils";

import wireConnectPin from "./operations/wire-connect-pin";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectJointToPinAction(action)) {
    return state;
  }

  const { wireId, jointId, pin } = action.payload;

  // FIXME: Let user select line id.
  const connectedState = wireConnectPin(
    state,
    wireId,
    jointId,
    pin,
    null,
    rootState
  );
  return connectedState ?? state;
});
