import {
  ClipboardState,
  defaultClipboardState,
} from "@/services/clipboard/state";
import { FieldState, defaultFieldState } from "@/services/node-layout/state";
import {
  NodeGraphState,
  defaultNodeGraphState,
} from "@/services/node-graph/state";
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
    clipboard: ClipboardState;
    field: FieldState;
    nodeGraph: NodeGraphState;
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
    clipboard: defaultClipboardState,
    field: defaultFieldState,
    nodeGraph: defaultNodeGraphState,
    selection: defaultSelectionState,
    simulator: defaultSimulatorState,
    view: defaultViewState,
  },
  ui: {
    circuitEditor: defaultCircuitEditorState,
  },
};

export const defaultAppState = Object.freeze(_defaultAppState);
