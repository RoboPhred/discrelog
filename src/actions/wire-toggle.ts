import { AnyAction } from "redux";
import { NodePin } from "@/types";

export const ACTION_WIRE_TOGGLE = "@wire/toggle" as const;
export const toggleWire = (p1: NodePin, p2: NodePin) => ({
  type: ACTION_WIRE_TOGGLE,
  payload: {
    p1,
    p2
  }
});
export type ToggleWireAction = ReturnType<typeof toggleWire>;
export function isToggleWireAction(
  action: AnyAction
): action is ToggleWireAction {
  return action.type === ACTION_WIRE_TOGGLE;
}
