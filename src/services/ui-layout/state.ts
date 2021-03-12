import { TesselValue } from "@/components/Tessel";

import { circuitFieldTesselWindow } from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";

import { ROOT_CIRCUIT_ID } from "../circuits/constants";

export interface UiLayoutServiceState {
  /**
   * The tessel layout.
   */
  layout: TesselValue | null;

  /**
   * The tessel path to the current active circuit editor.
   */
  activeCircuitEditorPath: string[];
}

const _defaultState: UiLayoutServiceState = {
  layout: {
    direction: "row",
    division: {
      firstSize: 200,
    },
    first: {
      direction: "column",
      division: 30,
      first: "circuits-list",
      second: "node-tray",
    },
    second: circuitFieldTesselWindow(ROOT_CIRCUIT_ID, []),
  },
  activeCircuitEditorPath: ["second"],
};

export const defaultUiLayoutServiceState = Object.freeze(_defaultState);
