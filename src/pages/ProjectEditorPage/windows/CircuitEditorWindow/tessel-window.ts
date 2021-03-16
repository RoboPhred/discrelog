import {
  isTesselWindow,
  TesselValue,
  TesselWindowItem,
} from "@/components/Tessel";

import { CircuitEditorWindowProps } from "./CircuitEditorWindow";

export const CIRCUIT_FIELD_WINDOW_ID = "circuit-field" as const;

export const circuitEditorTesselWindow = (
  circuitEditorId: string
): TesselWindowItem<CircuitEditorWindowProps> => ({
  windowId: CIRCUIT_FIELD_WINDOW_ID,
  windowProps: {
    editorId: circuitEditorId,
  },
});

export function isCircuitEditorTesselWindow(
  x: TesselValue
): x is Required<TesselWindowItem<CircuitEditorWindowProps>> {
  if (typeof x === "string") {
    // We must have props to be a proper circuit field.
    return false;
  }
  if (!isTesselWindow(x)) {
    return false;
  }
  return x.windowId === CIRCUIT_FIELD_WINDOW_ID;
}
