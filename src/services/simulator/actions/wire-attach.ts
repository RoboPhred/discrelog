import { NodePin } from "../types";
import { AnyAction } from "redux";

export const ACTION_WIRE_ATTACH = "@sim/wire/attach" as const;
export const attachWire = (
  outputNodeId: string,
  outputPin: string,
  inputNodeId: string,
  inputPin: string
) => ({
  type: ACTION_WIRE_ATTACH,
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
export type AttachWireAction = ReturnType<typeof attachWire>;
export function isAttachWireAction(
  action: AnyAction
): action is AttachWireAction {
  return action.type === ACTION_WIRE_ATTACH;
}
