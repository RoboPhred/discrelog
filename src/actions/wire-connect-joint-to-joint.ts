import { AnyAction } from "redux";

export const WIRE_CONNECT_JOINT_TO_JOINT_ACTION = "@wire/connect/joint-to-joint" as const;
export const connectWireJointToJoint = (
  jointId1: string,
  jointId2: string
) => ({
  type: WIRE_CONNECT_JOINT_TO_JOINT_ACTION,
  payload: { jointId1, jointId2 },
});
export type WireConnectJointToJointAction = ReturnType<
  typeof connectWireJointToJoint
>;
export function isWireConnectJointToJointAction(
  action: AnyAction
): action is WireConnectJointToJointAction {
  return action.type === WIRE_CONNECT_JOINT_TO_JOINT_ACTION;
}
