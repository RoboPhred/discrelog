import { Action } from "redux";

export const ACTION_NODE_MOUSEOVER = "@editor/node/mouseover" as "@editor/node/mouseover";
export const mouseOverNode = (nodeId: string | null) => ({ type: ACTION_NODE_MOUSEOVER, payload: { nodeId } });
export type MouseOverNodeAction = ReturnType<typeof mouseOverNode>;

export const ACTION_NODE_MOVE = "@editor/node/move" as "@editor/node/move";
export const moveNode = (nodeId: string, x: number, y: number) => ({
  type: ACTION_NODE_MOVE,
  payload: { nodeId, x, y }
});
export type MoveNodeAction = ReturnType<typeof moveNode>;

export type Actions =
  MouseOverNodeAction
  | MoveNodeAction;
