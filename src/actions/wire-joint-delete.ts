import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";

export const WIRE_JOINT_DELETE_ACTION = "@wire/joint/delete" as const;
export const deleteWireJoint = (jointId: MaybeArray<string>) => ({
  type: WIRE_JOINT_DELETE_ACTION,
  payload: { jointIds: asArray(jointId) },
});
export type WireJointDeleteAction = ReturnType<typeof deleteWireJoint>;
export function isWireJointDeleteAction(
  action: AnyAction
): action is WireJointDeleteAction {
  return action.type === WIRE_JOINT_DELETE_ACTION;
}
