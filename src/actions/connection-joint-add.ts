import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

import { Point } from "@/geometry";

export const ACTION_CONNECTION_JOINT_ADD = "@connection/joint/add" as const;
export const addConnectionJoint = (
  connectionId: string,
  addAfterJointId: string | null,
  position: Point,
  jointId?: string
) => ({
  type: ACTION_CONNECTION_JOINT_ADD,
  payload: {
    connectionId,
    jointId: jointId || uuidV4(),
    addAfterJointId,
    position,
  },
});
export type AddConnectionJointAction = ReturnType<typeof addConnectionJoint>;
export function isAddConnectionJointAction(
  action: AnyAction
): action is AddConnectionJointAction {
  return action.type === ACTION_CONNECTION_JOINT_ADD;
}
