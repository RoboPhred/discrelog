import { AnyAction } from "redux";

export const WIRE_CONNECT_JOINT_TO_JOINT_ACTION = "@wire/connect/joint-to-joint" as const;
export const connectWireJointToJoint = (
  wireId1: string,
  jointId1: string,
  wireId2: string,
  jointId2: string
) => ({
  type: WIRE_CONNECT_JOINT_TO_JOINT_ACTION,
  payload: { wireId1, jointId1, wireId2, jointId2 },
});
export type WireConnectJointToJointAction = ReturnType<
  typeof connectWireJointToJoint
>;
export function isWireConnectJointToJointAction(
  action: AnyAction
): action is WireConnectJointToJointAction {
  return action.type === WIRE_CONNECT_JOINT_TO_JOINT_ACTION;
}
