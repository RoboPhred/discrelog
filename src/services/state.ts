import {
  CircuitEditorUiState,
  defaultCircuitEditorUiState,
} from "./circuit-editor-ui/state";
import { CircuitsState, defaultCircuitsState } from "./circuits/state";
import { ClipboardState, defaultClipboardState } from "./clipboard/state";
import { DialogState, defaultDialogState } from "./dialog/state";
import { NodeGraphState, defaultNodeGraphState } from "./node-graph/state";
import { NodeLayoutState, defaultNodeLayoutState } from "./node-layout/state";
import { SelectionState, defaultSelectionState } from "./selection/state";
import { SimulatorState, defaultSimulatorState } from "./simulator/state";
import {
  SimulatorControlState,
  defaultSimulatorControlState,
} from "./simulator-control/state";
import {
  SimulatorGraphState,
  defaultSimulatorGraphState,
} from "./simulator-graph/state";

export interface AppServicesState {
  circuitEditorUi: CircuitEditorUiState;
  circuits: CircuitsState;
  clipboard: ClipboardState;
  dialog: DialogState;
  nodeGraph: NodeGraphState;
  nodeLayout: NodeLayoutState;
  selection: SelectionState;
  simulator: SimulatorState;
  simulatorControl: SimulatorControlState;
  simulatorGraph: SimulatorGraphState;
}

const _defaultServiceState: AppServicesState = {
  circuitEditorUi: defaultCircuitEditorUiState,
  nodeGraph: defaultNodeGraphState,
  nodeLayout: defaultNodeLayoutState,
  circuits: defaultCircuitsState,
  clipboard: defaultClipboardState,
  dialog: defaultDialogState,
  selection: defaultSelectionState,
  simulator: defaultSimulatorState,
  simulatorControl: defaultSimulatorControlState,
  simulatorGraph: defaultSimulatorGraphState,
};

export const defaultServicesState = Object.freeze(_defaultServiceState);
