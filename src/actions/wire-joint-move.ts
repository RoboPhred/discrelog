import { AnyAction } from "redux";
import { Point } from "@/types";

export const ACTION_WIRE_JOINT_MOVE = "@wire/joint/move" as const;
export const moveWireJoint = (
  wireId: string,
  jointIndex: number,
  position: Point
) => ({
  type: ACTION_WIRE_JOINT_MOVE,
  payload: {
    wireId,
    jointIndex,
    position
  }
});
export type MoveWireJointAction = ReturnType<typeof moveWireJoint>;
export function isMoveWireJointAction(
  action: AnyAction
): action is MoveWireJointAction {
  return action.type === ACTION_WIRE_JOINT_MOVE;
}
