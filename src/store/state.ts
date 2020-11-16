import {
  ClipboardState,
  defaultClipboardState,
} from "@/services/clipboard/state";
import {
  CircuitLayoutState,
  defaultCircuitLayoutState,
} from "@/services/circuit-layout/state";
import {
  CircuitGraphState,
  defaultCircuitGraphState,
} from "@/services/circuit-graph/state";
import {
  SelectionState,
  defaultSelectionState,
} from "@/services/selection/state";
import {
  SimulatorState,
  defaultSimulatorState,
} from "@/services/simulator/state";
import { ViewState, defaultViewState } from "@/services/view/state";

import {
  CircuitEditorState,
  defaultCircuitEditorState,
} from "@/pages/CircuitEditor/state";

export interface AppState {
  services: {
    circuitGraph: CircuitGraphState;
    circuitLayout: CircuitLayoutState;
    clipboard: ClipboardState;
    selection: SelectionState;
    simulator: SimulatorState;
    view: ViewState;
  };
  ui: {
    circuitEditor: CircuitEditorState;
  };
}

const _defaultAppState: AppState = {
  services: {
    circuitGraph: defaultCircuitGraphState,
    circuitLayout: defaultCircuitLayoutState,
    clipboard: defaultClipboardState,
    selection: defaultSelectionState,
    simulator: defaultSimulatorState,
    view: defaultViewState,
  },
  ui: {
    circuitEditor: defaultCircuitEditorState,
  },
};

export const defaultAppState = Object.freeze(_defaultAppState);
