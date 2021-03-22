import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { asArray, MaybeArray } from "@/arrays";

export interface MoveConnectionJointOpts {
  relative?: boolean;
  snapMode?: "none" | "element" | "joint";
}
export const ACTION_CONNECTION_JOINT_MOVE = "@connection/joint/move" as const;
export const moveConnectionJoint = (
  jointId: MaybeArray<string>,
  position: Point,
  opts: MoveConnectionJointOpts = {}
) => ({
  type: ACTION_CONNECTION_JOINT_MOVE,
  payload: {
    jointIds: asArray(jointId),
    position,
    relative: opts.relative ?? false,
    snapMode: opts.snapMode ?? "none",
  },
});
export type MoveConnectionJointAction = ReturnType<typeof moveConnectionJoint>;
export function isMoveConnectionJointAction(
  action: AnyAction
): action is MoveConnectionJointAction {
  return action.type === ACTION_CONNECTION_JOINT_MOVE;
}
