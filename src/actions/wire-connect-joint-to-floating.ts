import { AnyAction } from "redux";

import { Point } from "@/geometry";

export const WIRE_CONNECT_JOINT_TO_FLOATING_ACTION = "@wire/connect/joint-to-floating" as const;
export const connectJointToFloating = (jointId: string, floatPoint: Point) => ({
  type: WIRE_CONNECT_JOINT_TO_FLOATING_ACTION,
  payload: { floatPoint, jointId },
});
export type WireConnectJointToFloatingAction = ReturnType<
  typeof connectJointToFloating
>;
export function isWireConnectJointToFloatingAction(
  action: AnyAction
): action is WireConnectJointToFloatingAction {
  return action.type === WIRE_CONNECT_JOINT_TO_FLOATING_ACTION;
}
