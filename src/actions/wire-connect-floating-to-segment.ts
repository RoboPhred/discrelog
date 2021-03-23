import { Point } from "@/geometry";

export const WIRE_CONNECT_FLOATING_TO_SEGMENT_ACTION = "@wire/connect/floating-to-segment" as const;
export const connectFloatingToWireSegment = (
  floatPoint: Point,
  wireId: string,
  wireSegmentId: string,
  segmentPositionFraction: number
) => ({
  type: WIRE_CONNECT_FLOATING_TO_SEGMENT_ACTION,
  payload: { floatPoint, wireId, wireSegmentId, segmentPositionFraction },
});
