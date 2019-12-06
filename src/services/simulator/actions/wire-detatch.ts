import { NodePin } from "../types";
import { AnyAction } from "redux";

export const ACTION_WIRE_DETATCH = "@sim/wire/detatch" as const;
export const detatchWire = (
  outputNodeId: string,
  outputPin: string,
  inputNodeId: string,
  inputPin: string
) => ({
  type: ACTION_WIRE_DETATCH,
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
export type DetatchWireNodeAction = ReturnType<typeof detatchWire>;
export function isDetatchWireNodeAction(
  action: AnyAction
): action is DetatchWireNodeAction {
  return action.type === ACTION_WIRE_DETATCH;
}
