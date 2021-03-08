import { AnyAction } from "redux";

import { Rectangle } from "@/geometry";
import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_REGION = "@select/region" as const;
export const selectRegion = (
  region: Rectangle,
  circuitId: string,
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_REGION,
  payload: {
    region,
    circuitId,
    mode,
  },
});
export type SelectRegionAction = ReturnType<typeof selectRegion>;
export function isSelectRegionAction(
  action: AnyAction
): action is SelectRegionAction {
  return action.type === ACTION_SELECT_REGION;
}
