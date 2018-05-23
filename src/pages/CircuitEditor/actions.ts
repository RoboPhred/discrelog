import { Action } from "redux";

import { Rectangle } from "@/types";

export const ACTION_NODE_MOUSEOVER = "@editor/node/mouseover" as "@editor/node/mouseover";
export const mouseOverNode = (nodeId: string | null) => ({
  type: ACTION_NODE_MOUSEOVER,
  payload: { nodeId }
});
export type MouseOverNodeAction = ReturnType<typeof mouseOverNode>;

export const ACTION_NODE_MOVE = "@editor/node/move" as "@editor/node/move";
export const moveNode = (nodeId: string, x: number, y: number) => ({
  type: ACTION_NODE_MOVE,
  payload: { nodeId, x, y }
});
export type MoveNodeAction = ReturnType<typeof moveNode>;

export interface SelectActionModifiers {
  append?: boolean;
  remove?: boolean;
}
export const ACTION_SELECT_NODE = "@editor/select/node" as "@editor/select/node";
export const selectNode = (
  nodeId: string,
  modifiers?: SelectActionModifiers
) => ({
  type: ACTION_SELECT_NODE,
  payload: {
    nodeId,
    modifiers
  }
});
export type SelectNodeAction = ReturnType<typeof selectNode>;

export const ACTION_SELECT_REGION = "@editor/select/region" as "@editor/select/region";
export const selectRegion = (
  region: Rectangle,
  modifiers?: SelectActionModifiers
) => ({
  type: ACTION_SELECT_REGION,
  payload: {
    region,
    modifiers
  }
});
export type SelectRegionAction = ReturnType<typeof selectRegion>;

export const ACTION_SELECT_CLEAR = "@editor/select/clear" as "@editor/select/clear";
export const clearSelection = () => ({
  type: ACTION_SELECT_CLEAR
});
export type ClearSelectionAction = ReturnType<typeof clearSelection>;

export type Actions =
  | MouseOverNodeAction
  | MoveNodeAction
  | SelectNodeAction
  | SelectRegionAction
  | ClearSelectionAction;
