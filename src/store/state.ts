import {
  SimulatorState,
  defaultSimulatorState
} from "@/services/simulator/state";

import {
  CircuitEditorState,
  defaultCircuitEditorState
} from "@/pages/CircuitEditor/state";

export type GetState = () => AppState;

export interface AppState {
  services: {
    simulator: SimulatorState;
  };
  ui: {
    circuitEditor: CircuitEditorState;
  };
}

export const defaultAppState: AppState = {
  services: {
    simulator: defaultSimulatorState
  },
  ui: {
    circuitEditor: defaultCircuitEditorState
  }
};
