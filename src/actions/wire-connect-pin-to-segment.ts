import { ElementPin } from "@/services/circuit-graph/types";

export const WIRE_CONNECT_PIN_TO_SEGMENT_ACTION = "@wire/connect/pin-to-segment" as const;
export const connectPinToWireSegment = (
  pin: ElementPin,
  wireId: string,
  wireSegmentId: string,
  segmentPositionFraction: number
) => ({
  type: WIRE_CONNECT_PIN_TO_SEGMENT_ACTION,
  payload: { pin, wireId, wireSegmentId, segmentPositionFraction },
});
