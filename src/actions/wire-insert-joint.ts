import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

import { Point } from "@/geometry";

export const WIRE_INSERT_JOINT_ACTION = "@wire/insert-joint" as const;
export const wireInsertJoint = (
  wireId: string,
  wireSegmentId: string,
  jointPos: Point
) => ({
  type: WIRE_INSERT_JOINT_ACTION,
  payload: { wireId, wireSegmentId, jointPos, jointId: uuidV4() },
});
export type WireInsertJointAction = ReturnType<typeof wireInsertJoint>;
export function isWireInsertJointAction(
  action: AnyAction
): action is WireInsertJointAction {
  return action.type === WIRE_INSERT_JOINT_ACTION;
}
