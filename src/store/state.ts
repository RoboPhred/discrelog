import {
  SimulatorState,
  defaultSimulatorState
} from "@/services/simulator/state";

import {
  CircuitEditorState,
  defaultCircuitEditorState
} from "@/pages/CircuitEditor/state";
import { FieldState, defaultFieldState } from "@/services/field/state";

export interface AppState {
  services: {
    simulator: SimulatorState;
    field: FieldState;
  };
  ui: {
    circuitEditor: CircuitEditorState;
  };
}

export const defaultAppState: AppState = {
  services: {
    simulator: defaultSimulatorState,
    field: defaultFieldState
  },
  ui: {
    circuitEditor: defaultCircuitEditorState
  }
};
