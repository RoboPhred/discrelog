import { Point } from "@/geometry";
import { ElementPin } from "@/services/circuit-graph/types";

export const WIRE_CONNECT_PIN_TO_FLOATING_ACTION = "@wire/connect/pin-to-floating" as const;
export const connectPinToFloating = (pin: ElementPin, floatPoint: Point) => ({
  type: WIRE_CONNECT_PIN_TO_FLOATING_ACTION,
  payload: { floatPoint, pin },
});
