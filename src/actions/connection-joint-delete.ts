import { AnyAction } from "redux";

export const ACTION_CONNECTION_JOINT_DELETE = "@connection/joint/delete" as const;
export const deleteConnectionJoint = (jointId: string) => ({
  type: ACTION_CONNECTION_JOINT_DELETE,
  payload: { jointId },
});
export type DeleteConnectionJointAction = ReturnType<
  typeof deleteConnectionJoint
>;
export function isDeleteConnectionJointAction(
  action: AnyAction
): action is DeleteConnectionJointAction {
  return action.type === ACTION_CONNECTION_JOINT_DELETE;
}
