import {
  CircuitEditorUiDragServiceState,
  defaultCircuitEditorUiDragServiceState,
} from "./circuit-editor-ui-drag/state";
import {
  CircuitEditorUiSettingsState,
  defaultCircuitEditorUiSettingsState,
} from "./circuit-editor-ui-settings/state";
import {
  CircuitEditorUiViewportServiceState,
  defaultCircuitEditorUiViewportServiceState,
} from "./circuit-editor-ui-viewport/state";
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
  ProjectServiceState,
  defaultProjectServiceState,
} from "./project/state";
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
  circuitEditorUiDrag: CircuitEditorUiDragServiceState;
  circuitEditorUiSettings: CircuitEditorUiSettingsState;
  circuitEditorUiViewport: CircuitEditorUiViewportServiceState;
  circuits: CircuitsServiceState;
  clipboard: ClipboardServiceState;
  dialog: DialogServiceState;
  nodeGraph: NodeGraphServiceState;
  nodeLayout: NodeLayoutServiceState;
  project: ProjectServiceState;
  selection: SelectionServiceState;
  simulator: SimulatorServiceState;
  simulatorControl: SimulatorControlServiceState;
  simulatorGraph: SimulatorGraphServiceState;
}

const _defaultServiceState: AppServicesState = {
  circuitEditorUiDrag: defaultCircuitEditorUiDragServiceState,
  circuitEditorUiSettings: defaultCircuitEditorUiSettingsState,
  circuitEditorUiViewport: defaultCircuitEditorUiViewportServiceState,
  nodeGraph: defaultNodeGraphServiceState,
  nodeLayout: defaultNodeLayoutServiceState,
  circuits: defaultCircuitsServiceState,
  clipboard: defaultClipboardServiceState,
  dialog: defaultDialogServiceState,
  project: defaultProjectServiceState,
  selection: defaultSelectionServiceState,
  simulator: defaultSimulatorServiceState,
  simulatorControl: defaultSimulatorControlServiceState,
  simulatorGraph: defaultSimulatorGraphServiceState,
};

export const defaultServicesState = Object.freeze(_defaultServiceState);
