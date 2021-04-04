import { AnyAction } from "redux";

import { WireConnectTarget } from "@/services/circuit-graph/types";

export const ACTION_WIRE_CONNECT = "@wire/connect" as const;
export const wireConnect = (
  circuitId: string,
  from: WireConnectTarget,
  to: WireConnectTarget
) => ({
  type: ACTION_WIRE_CONNECT,
  payload: { circuitId, from, to },
});
export type WireConnectAction = ReturnType<typeof wireConnect>;
export function isWireConnectAction(
  action: AnyAction
): action is WireConnectAction {
  return action.type === ACTION_WIRE_CONNECT;
}
