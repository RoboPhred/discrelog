import { AnyAction } from "redux";
import uuidV4 from "uuid/v4";

import { NodePin } from "@/services/graph/types";

export const ACTION_WIRE_ATTACH = "@wire/attach" as const;
export const attachWire = (p1: NodePin, p2: NodePin) => ({
  type: ACTION_WIRE_ATTACH,
  payload: {
    wireId: uuidV4(),
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