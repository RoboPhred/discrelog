import { AnyAction } from "redux";

export const ACTION_WIRE_JOINT_DELETE = "@wire/joint/delete" as const;
export const deleteWireJoint = (jointId: string) => ({
  type: ACTION_WIRE_JOINT_DELETE,
  payload: { jointId },
});
export type DeleteWireJointAction = ReturnType<typeof deleteWireJoint>;
export function isDeleteWireJointAction(
  action: AnyAction
): action is DeleteWireJointAction {
  return action.type === ACTION_WIRE_JOINT_DELETE;
}
