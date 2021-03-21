import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_ELEMENT = "@field/drag/start/element" as const;
export const circuitEditorDragStartElement = (
  elementId: string,
  p: Point,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_ELEMENT,
  payload: {
    ...p,
    elementId,
    modifierKeys,
    editorId,
  },
});
export type CircuitEditorDragStartElementAction = ReturnType<
  typeof circuitEditorDragStartElement
>;
export function isCircuitEditorDragStartElementAction(
  action: AnyAction
): action is CircuitEditorDragStartElementAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_ELEMENT;
}
