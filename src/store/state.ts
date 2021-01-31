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
import { DialogState, defaultDialogState } from "@/services/dialog/state";
import {
  SelectionState,
  defaultSelectionState,
} from "@/services/selection/state";
import {
  SimulatorState,
  defaultSimulatorState,
} from "@/services/simulator/state";
import {
  SimulatorGraphState,
  defaultSimulatorGraphState,
} from "@/services/simulator-graph/state";

export interface AppState {
  services: {
    circuitEditorUi: CircuitEditorUiState;
    circuitGraph: CircuitGraphState;
    circuitLayout: CircuitLayoutState;
    clipboard: ClipboardState;
    dialog: DialogState;
    selection: SelectionState;
    simulator: SimulatorState;
    simulatorGraph: SimulatorGraphState;
  };
}

const _defaultAppState: AppState = {
  services: {
    circuitEditorUi: defaultCircuitEditorUiState,
    circuitGraph: defaultCircuitGraphState,
    circuitLayout: defaultCircuitLayoutState,
    clipboard: defaultClipboardState,
    dialog: defaultDialogState,
    selection: defaultSelectionState,
    simulator: defaultSimulatorState,
    simulatorGraph: defaultSimulatorGraphState,
  },
};

export const defaultAppState = Object.freeze(_defaultAppState);
