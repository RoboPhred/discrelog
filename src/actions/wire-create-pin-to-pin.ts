import { v4 as uuidV4 } from "uuid";

import { ElementPin } from "@/services/circuit-graph/types";
import { AnyAction } from "redux";

export const WIRE_CREATE_PIN_TO_PIN_ACTION = "@wire/create/pin-to-pin" as const;
export const createPinToPinWire = (pin1: ElementPin, pin2: ElementPin) => ({
  type: WIRE_CREATE_PIN_TO_PIN_ACTION,
  payload: {
    pin1,
    pin2,
    wireId: uuidV4(),
    segmentId: uuidV4(),
  },
});
export type WireCreatePinToPinAction = ReturnType<typeof createPinToPinWire>;
export function isWireCreatePinToPinAction(
  action: AnyAction
): action is WireCreatePinToPinAction {
  return action.type === WIRE_CREATE_PIN_TO_PIN_ACTION;
}
