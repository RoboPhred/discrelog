import { isWireConnectJointToJointAction } from "@/actions/wire-connect-joint-to-joint";
import { createCircuitGraphReducer } from "../utils";
import wireBridgeJoints from "./operations/wire-bridge-joints";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireConnectJointToJointAction(action)) {
    return state;
  }

  const { jointId1, jointId2 } = action.payload;

  return wireBridgeJoints(state, jointId1, jointId2);
});
