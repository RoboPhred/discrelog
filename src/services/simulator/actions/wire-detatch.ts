import { NodePin } from "../types";
import { AnyAction } from "redux";

export const ACTION_WIRE_DETATCH = "@sim/wire/detatch" as const;
export const detatchWire = (p1: NodePin, p2: NodePin) => ({
  type: ACTION_WIRE_DETATCH,
  payload: {
    p1,
    p2
  }
});
export type DetatchWireNodeAction = ReturnType<typeof detatchWire>;
export function isDetatchWireNodeAction(
  action: AnyAction
): action is DetatchWireNodeAction {
  return action.type === ACTION_WIRE_DETATCH;
}
