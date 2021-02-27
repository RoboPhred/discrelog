import { AnyAction } from "redux";

export const VIEW_NODE_NAMES = "@view/node-names" as const;
export const viewNodeNames = (mode: "all" | "named-only" | "none") => ({
  type: VIEW_NODE_NAMES,
  payload: { mode },
});
export type ViewNodeNamesAction = ReturnType<typeof viewNodeNames>;
export function isViewNodeNamesAction(
  action: AnyAction
): action is ViewNodeNamesAction {
  return action.type === VIEW_NODE_NAMES;
}
