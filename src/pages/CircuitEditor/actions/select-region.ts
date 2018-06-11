import { Rectangle } from "@/types";

import { SelectionMode } from "../types";

export const ACTION_SELECT_REGION = "@editor/select/region" as "@editor/select/region";
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
