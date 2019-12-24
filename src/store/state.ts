import {
  SimulatorState,
  defaultSimulatorState
} from "@/services/simulator/state";

import {
  CircuitEditorState,
  defaultCircuitEditorState
} from "@/pages/CircuitEditor/state";
import { FieldState, defaultFieldState } from "@/services/field/state";
import {
  ClipboardState,
  defaultClipboardState
} from "@/services/clipboard/state";

export interface AppState {
  services: {
    simulator: SimulatorState;
    field: FieldState;
    clipboard: ClipboardState;
  };
  ui: {
    circuitEditor: CircuitEditorState;
  };
}

const _defaultAppState: AppState = {
  services: {
    simulator: defaultSimulatorState,
    field: defaultFieldState,
    clipboard: defaultClipboardState
  },
  ui: {
    circuitEditor: defaultCircuitEditorState
  }
};

export const defaultAppState = Object.freeze(_defaultAppState);
