import { TesselValue } from "@/components/Tessel";

import { circuitEditorTesselWindow } from "@/pages/ProjectEditorPage/windows/CircuitEditorWindow/tessel-window";

import { DEFAULT_CIRCUIT_EDITOR_ID } from "@/services/circuit-editors/constants";

export interface UiLayoutServiceState {
  /**
   * The tessel layout.
   */
  layout: TesselValue | null;
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
      second: "element-tray",
    },
    second: {
      direction: "row",
      division: {
        secondSize: 200,
      },
      first: circuitEditorTesselWindow(DEFAULT_CIRCUIT_EDITOR_ID),
      second: "snapshots-list",
    },
  },
};

export const defaultUiLayoutServiceState = Object.freeze(_defaultState);
