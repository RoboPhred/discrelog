import { AnyAction } from "redux";

export const VIEW_ELEMENT_NAMES = "@view/element-names" as const;
export const viewElementNames = (mode: "all" | "named-only" | "none") => ({
  type: VIEW_ELEMENT_NAMES,
  payload: { mode },
});
export type ViewElementNamesAction = ReturnType<typeof viewElementNames>;
export function isViewElementNamesAction(
  action: AnyAction
): action is ViewElementNamesAction {
  return action.type === VIEW_ELEMENT_NAMES;
}
