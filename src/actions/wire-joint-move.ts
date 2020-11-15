import { AnyAction } from "redux";
import { Point } from "@/geometry";

export const ACTION_WIRE_JOINT_MOVE = "@wire/joint/move" as const;
export const moveWireJoint = (jointId: string, position: Point) => ({
  type: ACTION_WIRE_JOINT_MOVE,
  payload: {
    jointId,
    position,
  },
});
export type MoveWireJointAction = ReturnType<typeof moveWireJoint>;
export function isMoveWireJointAction(
  action: AnyAction
): action is MoveWireJointAction {
  return action.type === ACTION_WIRE_JOINT_MOVE;
}
