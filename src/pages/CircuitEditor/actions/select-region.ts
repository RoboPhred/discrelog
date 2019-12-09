import { AnyAction } from "redux";

import { Rectangle } from "@/types";

import { SelectionMode } from "../types";

export const ACTION_SELECT_REGION = "@editor/select/region" as const;
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
export function isSelectRegionAction(
  action: AnyAction
): action is SelectRegionAction {
  return action.type === ACTION_SELECT_REGION;
}
