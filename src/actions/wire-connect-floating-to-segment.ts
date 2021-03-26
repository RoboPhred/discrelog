import { AnyAction } from "redux";

import { Point } from "@/geometry";

export const WIRE_CONNECT_FLOATING_TO_SEGMENT_ACTION = "@wire/connect/floating-to-segment" as const;
export const connectFloatingToWireSegment = (
  floatPoint: Point,
  wireSegmentId: string,
  segmentSplitLength: number
) => ({
  type: WIRE_CONNECT_FLOATING_TO_SEGMENT_ACTION,
  payload: {
    floatPoint,
    wireSegmentId,
    segmentSplitLength,
  },
});
export type WireConnectFloatingToSegmentAction = ReturnType<
  typeof connectFloatingToWireSegment
>;
export function isWireConnectFloatingToSegmentAction(
  action: AnyAction
): action is WireConnectFloatingToSegmentAction {
  return action.type === WIRE_CONNECT_FLOATING_TO_SEGMENT_ACTION;
}
