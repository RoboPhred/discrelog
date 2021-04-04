import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";

export const ACTION_WIRE_JOINT_DELETE = "@wire/joint/delete" as const;
export const deleteWireJoint = (jointId: MaybeArray<string>) => ({
  type: ACTION_WIRE_JOINT_DELETE,
  payload: { jointIds: asArray(jointId) },
});
export type WireJointDeleteAction = ReturnType<typeof deleteWireJoint>;
export function isWireJointDeleteAction(
  action: AnyAction
): action is WireJointDeleteAction {
  return action.type === ACTION_WIRE_JOINT_DELETE;
}
