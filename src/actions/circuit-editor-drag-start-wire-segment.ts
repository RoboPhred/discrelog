import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const CIRCUIT_EDITOR_DRAG_START_WIRE_SEGMENT_ACTION = "@circuit-editor/drag/start/wire-segment" as const;
export const circuitEditorDragStartWireSegment = (
  p: Point,
  wireId: string,
  wireSegmentId: string,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: CIRCUIT_EDITOR_DRAG_START_WIRE_SEGMENT_ACTION,
  payload: {
    ...p,
    wireId,
    wireSegmentId,
    modifierKeys,
    editorId,
  },
});
export type CircuitEditorDragStartWireSegmentAction = ReturnType<
  typeof circuitEditorDragStartWireSegment
>;
export function isCircuitEditorDragStartWireSegmentAction(
  action: AnyAction
): action is CircuitEditorDragStartWireSegmentAction {
  return action.type === CIRCUIT_EDITOR_DRAG_START_WIRE_SEGMENT_ACTION;
}
