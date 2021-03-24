import { AnyAction } from "redux";

import { ElementPin } from "@/services/circuit-graph/types";

export const WIRE_CONNECT_PIN_TO_SEGMENT_ACTION = "@wire/connect/pin-to-segment" as const;
export const connectPinToWireSegment = (
  pin: ElementPin,
  wireId: string,
  wireSegmentId: string,
  segmentSplitLength: number
) => ({
  type: WIRE_CONNECT_PIN_TO_SEGMENT_ACTION,
  payload: { pin, wireId, wireSegmentId, segmentSplitLength },
});
export type WireConnectPinToSegmentAction = ReturnType<
  typeof connectPinToWireSegment
>;
export function isWireConnectPinToSegmentAction(
  action: AnyAction
): action is WireConnectPinToSegmentAction {
  return action.type === WIRE_CONNECT_PIN_TO_SEGMENT_ACTION;
}
