import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

import { Point } from "@/geometry";

import { ElementPin } from "@/services/element-graph/types";

export interface AttachWireOptions {
  joints?: Point[];
}
export const ACTION_WIRE_ATTACH = "@wire/attach" as const;
export const attachWire = (
  p1: ElementPin,
  p2: ElementPin,
  opts?: AttachWireOptions
) => ({
  type: ACTION_WIRE_ATTACH,
  payload: {
    connectionId: uuidV4(),
    p1,
    p2,
    joints: opts?.joints || [],
  },
});
export type AttachWireAction = ReturnType<typeof attachWire>;
export function isAttachWireAction(
  action: AnyAction
): action is AttachWireAction {
  return action.type === ACTION_WIRE_ATTACH;
}
