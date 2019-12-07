import { NodePin } from "../types";
import { AnyAction } from "redux";

export const ACTION_WIRE_ATTACH = "@sim/wire/attach" as const;
export const attachWire = (p1: NodePin, p2: NodePin) => ({
  type: ACTION_WIRE_ATTACH,
  payload: {
    p1,
    p2
  }
});
export type AttachWireAction = ReturnType<typeof attachWire>;
export function isAttachWireAction(
  action: AnyAction
): action is AttachWireAction {
  return action.type === ACTION_WIRE_ATTACH;
}
