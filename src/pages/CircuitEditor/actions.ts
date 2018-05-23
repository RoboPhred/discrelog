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

export const ACTION_SELECT_REGION = "@editor/select-region" as "@editor/select-region";
export const selectRegion = (r: Rectangle) => ({
  type: ACTION_SELECT_REGION,
  payload: r
});
export type SelectRegionAction = ReturnType<typeof selectRegion>;

export type Actions = MouseOverNodeAction | MoveNodeAction | SelectRegionAction;
