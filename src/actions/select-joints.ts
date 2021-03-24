import { AnyAction } from "redux";

import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_JOINTS = "@select/joints" as const;
export const selectJoints = (
  jointId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_JOINTS,
  payload: {
    jointIds: Array.isArray(jointId) ? jointId : [jointId],
    mode,
  },
});
export type SelectJointsAction = ReturnType<typeof selectJoints>;
export function isSelectJointsAction(
  action: AnyAction
): action is SelectJointsAction {
  return action.type === ACTION_SELECT_JOINTS;
}
