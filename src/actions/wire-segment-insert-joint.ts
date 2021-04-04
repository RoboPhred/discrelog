import { AnyAction } from "redux";

import { Point } from "@/geometry";

export const ACTION_WIRE_SEGMENT_INSERT_JOINT = "@wire/segment/insert-joint" as const;
export const wireSegmentInsertJoint = (
  wireId: string,
  wireSegmentId: string,
  jointPos: Point
) => ({
  type: ACTION_WIRE_SEGMENT_INSERT_JOINT,
  payload: { wireId, wireSegmentId, jointPos },
});
export type WireSegmentInsertJointAction = ReturnType<
  typeof wireSegmentInsertJoint
>;
export function isWireSegmentInsertJointAction(
  action: AnyAction
): action is WireSegmentInsertJointAction {
  return action.type === ACTION_WIRE_SEGMENT_INSERT_JOINT;
}
