import { AnyAction } from "redux";

import { Point } from "@/geometry";

export const WIRE_SEGMENT_INSERT_JOINT_ACTION = "@wire/segment/insert-joint" as const;
export const wireSegmentInsertJoint = (
  wireId: string,
  wireSegmentId: string,
  jointPos: Point
) => ({
  type: WIRE_SEGMENT_INSERT_JOINT_ACTION,
  payload: { wireId, wireSegmentId, jointPos },
});
export type WireSegmentInsertJointAction = ReturnType<
  typeof wireSegmentInsertJoint
>;
export function isWireSegmentInsertJointAction(
  action: AnyAction
): action is WireSegmentInsertJointAction {
  return action.type === WIRE_SEGMENT_INSERT_JOINT_ACTION;
}
