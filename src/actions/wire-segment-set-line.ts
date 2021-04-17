import { AnyAction } from "redux";

export const ACTION_WIRE_SEGMENT_SET_LINE = "@wire/segment/set-line" as const;
export const wireSegmentSetLine = (wireSegmentId: string, lineId: string) => ({
  type: ACTION_WIRE_SEGMENT_SET_LINE,
  payload: { wireSegmentId, lineId },
});
export type WireSegmentSetLineAction = ReturnType<typeof wireSegmentSetLine>;
export function isWireSegmentSetLineAction(
  action: AnyAction
): action is WireSegmentSetLineAction {
  return action.type === ACTION_WIRE_SEGMENT_SET_LINE;
}
