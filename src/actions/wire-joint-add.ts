import { AnyAction } from "redux";
import uuidV4 from "uuid/v4";
import { Point } from "@/types";

export const ACTION_WIRE_JOINT_ADD = "@wire/joint/add" as const;
export const addWireJoint = (
  wireId: string,
  addAfterJointId: string | null,
  position: Point,
  jointId?: string
) => ({
  type: ACTION_WIRE_JOINT_ADD,
  payload: {
    wireId,
    jointId: jointId || uuidV4(),
    addAfterJointId,
    position
  }
});
export type AddWireJointAction = ReturnType<typeof addWireJoint>;
export function isAddWireJointAction(
  action: AnyAction
): action is AddWireJointAction {
  return action.type === ACTION_WIRE_JOINT_ADD;
}
