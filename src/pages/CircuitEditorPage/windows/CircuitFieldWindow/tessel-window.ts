import {
  isTesselWindow,
  TesselValue,
  TesselWindowItem,
} from "@/components/Tessel";

import { CircuitFieldWindowProps } from "./CircuitFieldWindow";

const CIRCUIT_FIELD_ID = "circuit-field" as const;

export const circuitFieldTesselWindow = (
  circuitId: string,
  circuitNodeIdPath: string[]
): TesselWindowItem<CircuitFieldWindowProps> => ({
  windowId: CIRCUIT_FIELD_ID,
  windowProps: {
    circuitId,
    circuitNodeIdPath,
  },
});

export function isCircuitFieldTesselWindow(
  x: TesselValue
): x is Required<TesselWindowItem<CircuitFieldWindowProps>> {
  if (typeof x === "string") {
    // We must have props to be a proper circuit field.
    return false;
  }
  if (!isTesselWindow(x)) {
    return false;
  }
  return x.windowId === CIRCUIT_FIELD_ID;
}
