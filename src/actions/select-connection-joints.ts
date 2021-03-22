import { AnyAction } from "redux";

import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_CONNECTION_JOINTS = "@select/connection-joints" as const;
export const selectConnectionJoints = (
  jointId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_CONNECTION_JOINTS,
  payload: {
    jointIds: Array.isArray(jointId) ? jointId : [jointId],
    mode,
  },
});
export type SelectConnectionJointsAction = ReturnType<
  typeof selectConnectionJoints
>;
export function isSelectConnectionJointsAction(
  action: AnyAction
): action is SelectConnectionJointsAction {
  return action.type === ACTION_SELECT_CONNECTION_JOINTS;
}
