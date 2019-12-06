import { NodePin } from "../types";
import { AnyAction } from "redux";

export const ACTION_WIRE_TOGGLE = "@sim/wire/toggle" as const;
export const toggleWire = (
  outputNodeId: string,
  outputPin: string,
  inputNodeId: string,
  inputPin: string
) => ({
  type: ACTION_WIRE_TOGGLE,
  payload: {
    outputPin: {
      nodeId: outputNodeId,
      pin: outputPin
    } as NodePin,
    inputPin: {
      nodeId: inputNodeId,
      pin: inputPin
    } as NodePin
  }
});
export type ToggleWireAction = ReturnType<typeof toggleWire>;
export function isToggleWireAction(
  action: AnyAction
): action is ToggleWireAction {
  return action.type === ACTION_WIRE_TOGGLE;
}
