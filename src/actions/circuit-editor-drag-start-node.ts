import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_NODE = "@field/drag/start/node" as const;
export const circuitEditorDragStartNode = (
  nodeId: string,
  p: Point,
  modifierKeys: ModifierKeys
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_NODE,
  payload: {
    ...p,
    nodeId,
    modifierKeys,
  },
});
export type CircuitEditorDragStartNodeAction = ReturnType<
  typeof circuitEditorDragStartNode
>;
export function isCircuitEditorDragStartNodeAction(
  action: AnyAction
): action is CircuitEditorDragStartNodeAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_NODE;
}
