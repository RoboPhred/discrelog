import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { asArray, MaybeArray } from "@/arrays";

export const ACTION_WIRE_JOINT_MOVE = "@wire/joint/move" as const;
export interface JointMoveOpts {
  relative?: boolean;
  snapMode?: "none" | "element" | "joint";
}
export const moveWireJoint = (
  jointId: MaybeArray<string>,
  p: Point,
  { relative = false, snapMode = "none" }: JointMoveOpts = {}
) => ({
  type: ACTION_WIRE_JOINT_MOVE,
  payload: { jointIds: asArray(jointId), position: p, relative, snapMode },
});
export type WireJointMoveAction = ReturnType<typeof moveWireJoint>;
export function isWireJointMoveAction(
  action: AnyAction
): action is WireJointMoveAction {
  return action.type === ACTION_WIRE_JOINT_MOVE;
}
