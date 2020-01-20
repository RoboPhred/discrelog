import { AnyAction } from "redux";

import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_WIRE_JOINTS = "@select/wire-joints" as const;
export const selectWireJoints = (
  jointId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_WIRE_JOINTS,
  payload: {
    jointIds: Array.isArray(jointId) ? jointId : [jointId],
    mode
  }
});
export type SelectWireJointsAction = ReturnType<typeof selectWireJoints>;
export function isSelectWireJointsAction(
  action: AnyAction
): action is SelectWireJointsAction {
  return action.type === ACTION_SELECT_WIRE_JOINTS;
}
