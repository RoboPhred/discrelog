import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";

export const ACTION_WIRE_SEGMENT_DELETE = "@wire/segment/delete" as const;
export const deleteWireSegment = (segmentId: MaybeArray<string>) => ({
  type: ACTION_WIRE_SEGMENT_DELETE,
  payload: { segmentIds: asArray(segmentId) },
});
export type WireSegmentDeleteAction = ReturnType<typeof deleteWireSegment>;
export function isWireSegmentDeleteAction(
  action: AnyAction
): action is WireSegmentDeleteAction {
  return action.type === ACTION_WIRE_SEGMENT_DELETE;
}
