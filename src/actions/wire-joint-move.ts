import { AnyAction } from "redux";

import { Point } from "@/geometry";

export const WIRE_JOINT_MOVE_ACTION = "@wire/joint/move" as const;
export const moveWireJoint = (jointId: string, p: Point) => ({
  type: WIRE_JOINT_MOVE_ACTION,
  payload: { jointId, ...p },
});
export type WireJointMoveAction = ReturnType<typeof moveWireJoint>;
export function isWireJointMoveAction(
  action: AnyAction
): action is WireJointMoveAction {
  return action.type === WIRE_JOINT_MOVE_ACTION;
}
