import {
  CircuitEditorUiState,
  defaultCircuitEditorUiState,
} from "@/services/circuit-editor-ui/state";
import {
  CircuitGraphState,
  defaultCircuitGraphState,
} from "@/services/circuit-graph/state";
import {
  CircuitLayoutState,
  defaultCircuitLayoutState,
} from "@/services/circuit-layout/state";
import {
  ClipboardState,
  defaultClipboardState,
} from "@/services/clipboard/state";
import {
  SelectionState,
  defaultSelectionState,
} from "@/services/selection/state";
import {
  SimulatorState,
  defaultSimulatorState,
} from "@/services/simulator/state";

import {
  CircuitEditorState,
  defaultCircuitEditorState,
} from "@/pages/CircuitEditor/state";

export interface AppState {
  services: {
    circuitEditorUi: CircuitEditorUiState;
    circuitGraph: CircuitGraphState;
    circuitLayout: CircuitLayoutState;
    clipboard: ClipboardState;
    selection: SelectionState;
    simulator: SimulatorState;
  };
  ui: {
    circuitEditor: CircuitEditorState;
  };
}

const _defaultAppState: AppState = {
  services: {
    circuitEditorUi: defaultCircuitEditorUiState,
    circuitGraph: defaultCircuitGraphState,
    circuitLayout: defaultCircuitLayoutState,
    clipboard: defaultClipboardState,
    selection: defaultSelectionState,
    simulator: defaultSimulatorState,
  },
  ui: {
    circuitEditor: defaultCircuitEditorState,
  },
};

export const defaultAppState = Object.freeze(_defaultAppState);
