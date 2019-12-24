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
import {
  SelectionState,
  defaultSelectionState
} from "@/services/selection/state";

export interface AppState {
  services: {
    simulator: SimulatorState;
    field: FieldState;
    selection: SelectionState;
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
    selection: defaultSelectionState,
    clipboard: defaultClipboardState
  },
  ui: {
    circuitEditor: defaultCircuitEditorState
  }
};

export const defaultAppState = Object.freeze(_defaultAppState);
