import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ElementPin } from "@/services/circuit-graph/types";

export const WIRE_CONNECT_PIN_TO_FLOATING_ACTION = "@wire/connect/pin-to-floating" as const;
export const connectPinToFloating = (pin: ElementPin, floatPoint: Point) => ({
  type: WIRE_CONNECT_PIN_TO_FLOATING_ACTION,
  payload: { floatPoint, pin },
});
export type WireConnectPinToFloatingAction = ReturnType<
  typeof connectPinToFloating
>;
export function isWireConnectPinToFloatingAction(
  action: AnyAction
): action is WireConnectPinToFloatingAction {
  return action.type === WIRE_CONNECT_PIN_TO_FLOATING_ACTION;
}
