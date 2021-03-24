import { v4 as uuidV4 } from "uuid";
import { AnyAction } from "redux";

import { ElementPin } from "@/services/circuit-graph/types";

export const WIRE_CONNECT_PIN_TO_PIN_ACTION = "@wire/connect/pin-to-pin" as const;
export const connectPinToPin = (pin1: ElementPin, pin2: ElementPin) => ({
  type: WIRE_CONNECT_PIN_TO_PIN_ACTION,
  payload: {
    pin1,
    pin2,
    newWireId: uuidV4(),
  },
});
export type WireConnectPinToPinAction = ReturnType<typeof connectPinToPin>;
export function isWireConnectPinToPinAction(
  action: AnyAction
): action is WireConnectPinToPinAction {
  return action.type === WIRE_CONNECT_PIN_TO_PIN_ACTION;
}
