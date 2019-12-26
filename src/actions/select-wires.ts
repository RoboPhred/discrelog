import { AnyAction } from "redux";

import { SelectionMode } from "@/types";

export const ACTION_SELECT_NODES = "@select/wires" as const;
export const selectWires = (
  wireId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_NODES,
  payload: {
    wireIds: Array.isArray(wireId) ? wireId : [wireId],
    mode
  }
});
export type SelectWiresAction = ReturnType<typeof selectWires>;
export function isSelectWiresAction(
  action: AnyAction
): action is SelectWiresAction {
  return action.type === ACTION_SELECT_NODES;
}
