import { Action } from "redux";

import { Rectangle } from "@/types";

export type SelectionMode = "set" | "append" | "remove" | "toggle";

export const ACTION_NODE_MOUSEOVER = "@editor/node/mouseover" as "@editor/node/mouseover";
export const mouseOverNode = (nodeId: string | null) => ({
  type: ACTION_NODE_MOUSEOVER,
  payload: { nodeId }
});
export type MouseOverNodeAction = ReturnType<typeof mouseOverNode>;

export const ACTION_MOVE_SELECTED = "@editor/move-selected" as "@editor/move-selected";
export const moveSelected = (offsetX: number, offsetY: number) => ({
  type: ACTION_MOVE_SELECTED,
  payload: { offsetX, offsetY }
});
export type MoveNodeAction = ReturnType<typeof moveSelected>;

export const ACTION_SELECT_NODES = "@editor/select/nodes" as "@editor/select/nodes";
export const selectNode = (
  nodeId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_NODES,
  payload: {
    nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId],
    mode
  }
});
export type SelectNodeAction = ReturnType<typeof selectNode>;

export const ACTION_SELECT_REGION = "@editor/select/region" as "@editor/select/region";
export const selectRegion = (
  region: Rectangle,
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_REGION,
  payload: {
    region,
    mode
  }
});
export type SelectRegionAction = ReturnType<typeof selectRegion>;

export const ACTION_SELECT_CLEAR = "@editor/select/clear" as "@editor/select/clear";
export const clearSelection = () => ({
  type: ACTION_SELECT_CLEAR
});
export type ClearSelectionAction = ReturnType<typeof clearSelection>;

export type CircuitEditorAction =
  | MouseOverNodeAction
  | MoveNodeAction
  | SelectNodeAction
  | SelectRegionAction
  | ClearSelectionAction;
