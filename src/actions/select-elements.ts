import { AnyAction } from "redux";

import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_ELEMENTS = "@select/elements" as const;
export const selectElements = (
  elementId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_ELEMENTS,
  payload: {
    elementIds: Array.isArray(elementId) ? elementId : [elementId],
    mode,
  },
});
export type SelectElementsAction = ReturnType<typeof selectElements>;
export function isSelectElementsAction(
  action: AnyAction
): action is SelectElementsAction {
  return action.type === ACTION_SELECT_ELEMENTS;
}
