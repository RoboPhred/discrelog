import { AnyAction } from "redux";

import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_WIRE_SEGMENTS = "@select/wire-segments" as const;
export const selectWireSegments = (
  segmentId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_WIRE_SEGMENTS,
  payload: {
    segmentIds: Array.isArray(segmentId) ? segmentId : [segmentId],
    mode,
  },
});
export type SelectWireSegmentsAction = ReturnType<typeof selectWireSegments>;
export function isSelectWireSegmentsAction(
  action: AnyAction
): action is SelectWireSegmentsAction {
  return action.type === ACTION_SELECT_WIRE_SEGMENTS;
}
