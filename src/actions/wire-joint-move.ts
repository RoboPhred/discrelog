import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { asArray, MaybeArray } from "@/arrays";

export const WIRE_JOINT_MOVE_ACTION = "@wire/joint/move" as const;
export interface JointMoveOpts {
  relative?: boolean;
  snapMode?: "none" | "element" | "joint";
}
export const moveWireJoint = (
  jointId: MaybeArray<string>,
  p: Point,
  { relative = false, snapMode = "none" }: JointMoveOpts = {}
) => ({
  type: WIRE_JOINT_MOVE_ACTION,
  payload: { jointIds: asArray(jointId), position: p, relative, snapMode },
});
export type WireJointMoveAction = ReturnType<typeof moveWireJoint>;
export function isWireJointMoveAction(
  action: AnyAction
): action is WireJointMoveAction {
  return action.type === WIRE_JOINT_MOVE_ACTION;
}
