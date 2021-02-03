import {
  CircuitEditorUiState,
  defaultCircuitEditorUiState,
} from "@/services/circuit-editor-ui/state";
import { CircuitsState, defaultCircuitsState } from "@/services/circuits/state";
import {
  ClipboardState,
  defaultClipboardState,
} from "@/services/clipboard/state";
import { DialogState, defaultDialogState } from "@/services/dialog/state";
import {
  NodeGraphState,
  defaultNodeGraphState,
} from "@/services/node-graph/state";
import {
  NodeLayoutState,
  defaultNodeLayoutState,
} from "@/services/node-layout/state";
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
    circuits: CircuitsState;
    clipboard: ClipboardState;
    dialog: DialogState;
    nodeGraph: NodeGraphState;
    nodeLayout: NodeLayoutState;
    selection: SelectionState;
    simulator: SimulatorState;
    simulatorGraph: SimulatorGraphState;
  };
}

const _defaultAppState: AppState = {
  services: {
    circuitEditorUi: defaultCircuitEditorUiState,
    nodeGraph: defaultNodeGraphState,
    nodeLayout: defaultNodeLayoutState,
    circuits: defaultCircuitsState,
    clipboard: defaultClipboardState,
    dialog: defaultDialogState,
    selection: defaultSelectionState,
    simulator: defaultSimulatorState,
    simulatorGraph: defaultSimulatorGraphState,
  },
};

export const defaultAppState = Object.freeze(_defaultAppState);
