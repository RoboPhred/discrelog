import { AnyAction } from "redux";

import { WireConnectTarget } from "@/services/circuit-graph/types";

export const WIRE_CONNECT_ACTION = "@wire/connect" as const;
export const wireConnect = (
  circuitId: string,
  from: WireConnectTarget,
  to: WireConnectTarget
) => ({
  type: WIRE_CONNECT_ACTION,
  payload: { circuitId, from, to },
});
export type WireConnectAction = ReturnType<typeof wireConnect>;
export function isWireConnectAction(
  action: AnyAction
): action is WireConnectAction {
  return action.type === WIRE_CONNECT_ACTION;
}
