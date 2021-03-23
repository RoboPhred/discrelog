import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

import { Point } from "@/geometry";

export const WIRE_SEGMENT_INSERT_JOINT_ACTION = "@wire/segment/insert-joint" as const;
export interface WireSegmentInsertJointOpts {
  jointId?: string;
}
export const wireSegmentInsertJoint = (
  wireId: string,
  wireSegmentId: string,
  jointPos: Point,
  { jointId }: WireSegmentInsertJointOpts = {}
) => ({
  type: WIRE_SEGMENT_INSERT_JOINT_ACTION,
  payload: { wireId, wireSegmentId, jointPos, jointId: jointId ?? uuidV4() },
});
export type WireSegmentInsertJointAction = ReturnType<
  typeof wireSegmentInsertJoint
>;
export function isWireSegmentInsertJointAction(
  action: AnyAction
): action is WireSegmentInsertJointAction {
  return action.type === WIRE_SEGMENT_INSERT_JOINT_ACTION;
}
