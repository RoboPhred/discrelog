import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { asArray, MaybeArray } from "@/arrays";

export interface MoveWireJointOpts {
  relative?: boolean;
  snapMode?: "none" | "element" | "joint";
}
export const ACTION_WIRE_JOINT_MOVE = "@wire/joint/move" as const;
export const moveWireJoint = (
  jointId: MaybeArray<string>,
  position: Point,
  opts: MoveWireJointOpts = {}
) => ({
  type: ACTION_WIRE_JOINT_MOVE,
  payload: {
    jointIds: asArray(jointId),
    position,
    relative: opts.relative ?? false,
    snapMode: opts.snapMode ?? "none",
  },
});
export type MoveWireJointAction = ReturnType<typeof moveWireJoint>;
export function isMoveWireJointAction(
  action: AnyAction
): action is MoveWireJointAction {
  return action.type === ACTION_WIRE_JOINT_MOVE;
}
