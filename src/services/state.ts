import {
  CircuitEditorUiServiceState,
  defaultCircuitEditorUiServiceState,
} from "./circuit-editor-ui/state";
import {
  CircuitsServiceState,
  defaultCircuitsServiceState,
} from "./circuits/state";
import {
  ClipboardServiceState,
  defaultClipboardServiceState,
} from "./clipboard/state";
import { DialogServiceState, defaultDialogServiceState } from "./dialog/state";
import {
  NodeGraphServiceState,
  defaultNodeGraphServiceState,
} from "./node-graph/state";
import {
  NodeLayoutServiceState,
  defaultNodeLayoutServiceState,
} from "./node-layout/state";
import {
  SelectionServiceState,
  defaultSelectionServiceState,
} from "./selection/state";
import {
  SimulatorServiceState,
  defaultSimulatorServiceState,
} from "./simulator/state";
import {
  SimulatorControlServiceState,
  defaultSimulatorControlServiceState,
} from "./simulator-control/state";
import {
  SimulatorGraphServiceState,
  defaultSimulatorGraphServiceState,
} from "./simulator-graph/state";

export interface AppServicesState {
  circuitEditorUi: CircuitEditorUiServiceState;
  circuits: CircuitsServiceState;
  clipboard: ClipboardServiceState;
  dialog: DialogServiceState;
  nodeGraph: NodeGraphServiceState;
  nodeLayout: NodeLayoutServiceState;
  selection: SelectionServiceState;
  simulator: SimulatorServiceState;
  simulatorControl: SimulatorControlServiceState;
  simulatorGraph: SimulatorGraphServiceState;
}

const _defaultServiceState: AppServicesState = {
  circuitEditorUi: defaultCircuitEditorUiServiceState,
  nodeGraph: defaultNodeGraphServiceState,
  nodeLayout: defaultNodeLayoutServiceState,
  circuits: defaultCircuitsServiceState,
  clipboard: defaultClipboardServiceState,
  dialog: defaultDialogServiceState,
  selection: defaultSelectionServiceState,
  simulator: defaultSimulatorServiceState,
  simulatorControl: defaultSimulatorControlServiceState,
  simulatorGraph: defaultSimulatorGraphServiceState,
};

export const defaultServicesState = Object.freeze(_defaultServiceState);
