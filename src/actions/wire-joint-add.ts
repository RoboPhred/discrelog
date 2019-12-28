import { AnyAction } from "redux";
import { Point } from "@/types";

export const ACTION_WIRE_JOINT_ADD = "@wire/joint/add" as const;
export const addWireJoint = (
  wireId: string,
  jointIndex: number,
  position: Point
) => ({
  type: ACTION_WIRE_JOINT_ADD,
  payload: {
    wireId,
    jointIndex,
    position
  }
});
export type AddWireJointAction = ReturnType<typeof addWireJoint>;
export function isAddWireJointAction(
  action: AnyAction
): action is AddWireJointAction {
  return action.type === ACTION_WIRE_JOINT_ADD;
}
