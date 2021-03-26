import { isWireConnectJointToJointAction } from "@/actions/wire-connect-joint-to-joint";
import { createCircuitGraphReducer } from "../utils";
import wireBridgeJoints from "./operations/wire-bridge-joints";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireConnectJointToJointAction(action)) {
    return state;
  }

  const { wireId1, jointId1, wireId2, jointId2 } = action.payload;

  return wireBridgeJoints(state, wireId1, jointId1, wireId2, jointId2);
});
