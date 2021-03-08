import { AnyAction } from "redux";

import { TesselValue } from "@/components/Tessel";

export const ACTION_LAYOUT_REARRANGE = "@layout/rearrange" as const;
export const rearrangeLayout = (layout: TesselValue) => ({
  type: ACTION_LAYOUT_REARRANGE,
  payload: { layout },
});
export type RearrangeLayoutActionType = ReturnType<typeof rearrangeLayout>;
export function isRearrangeLayoutAction(
  action: AnyAction
): action is RearrangeLayoutActionType {
  return action.type === ACTION_LAYOUT_REARRANGE;
}
