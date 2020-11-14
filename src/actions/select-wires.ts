import { AnyAction } from "redux";

import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_WIRES = "@select/wires" as const;
export const selectWires = (
  wireId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_WIRES,
  payload: {
    wireIds: Array.isArray(wireId) ? wireId : [wireId],
    mode,
  },
});
export type SelectWiresAction = ReturnType<typeof selectWires>;
export function isSelectWiresAction(
  action: AnyAction
): action is SelectWiresAction {
  return action.type === ACTION_SELECT_WIRES;
}
