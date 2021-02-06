import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { asArray, MaybeArray } from "@/arrays";

export const ACTION_WIRE_JOINT_MOVE = "@wire/joint/move" as const;
export const moveWireJoint = (
  jointId: MaybeArray<string>,
  position: Point,
  relative = false
) => ({
  type: ACTION_WIRE_JOINT_MOVE,
  payload: {
    jointIds: asArray(jointId),
    position,
    relative,
  },
});
export type MoveWireJointAction = ReturnType<typeof moveWireJoint>;
export function isMoveWireJointAction(
  action: AnyAction
): action is MoveWireJointAction {
  return action.type === ACTION_WIRE_JOINT_MOVE;
}

export const ACTION_WIRE_JOINT_MOVE_END = "@wire/joint/end-move" as const;
export const moveWireJointEnd = () => ({
  type: ACTION_WIRE_JOINT_MOVE_END,
});
