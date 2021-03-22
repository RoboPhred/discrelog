import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

import { Point } from "@/geometry";

import { ElementPin } from "@/services/circuit-graph/types";

export interface AttachConnectionOptions {
  joints?: Point[];
}
export const ACTION_CONNECTION_ATTACH = "@connection/attach" as const;
export const attachConnection = (
  p1: ElementPin,
  p2: ElementPin,
  opts?: AttachConnectionOptions
) => ({
  type: ACTION_CONNECTION_ATTACH,
  payload: {
    connectionId: uuidV4(),
    p1,
    p2,
    joints: opts?.joints || [],
  },
});
export type AttachConnectionAction = ReturnType<typeof attachConnection>;
export function isAttachConnectionAction(
  action: AnyAction
): action is AttachConnectionAction {
  return action.type === ACTION_CONNECTION_ATTACH;
}
