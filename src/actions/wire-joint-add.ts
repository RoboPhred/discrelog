import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

import { Point } from "@/geometry";

export const ACTION_WIRE_JOINT_ADD = "@wire/joint/add" as const;
export const addWireJoint = (
  connectionId: string,
  addAfterJointId: string | null,
  position: Point,
  jointId?: string
) => ({
  type: ACTION_WIRE_JOINT_ADD,
  payload: {
    connectionId,
    jointId: jointId || uuidV4(),
    addAfterJointId,
    position,
  },
});
export type AddWireJointAction = ReturnType<typeof addWireJoint>;
export function isAddWireJointAction(
  action: AnyAction
): action is AddWireJointAction {
  return action.type === ACTION_WIRE_JOINT_ADD;
}
