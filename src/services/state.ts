import {
  CircuitEditorDragServiceState,
  defaultCircuitEditorDragServiceState,
} from "./circuit-editor-drag/state";
import {
  CircuitEditorsServiceState,
  defaultCircuitEditorServiceState,
} from "./circuit-editors/state";
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
  UiLayoutServiceState,
  defaultUiLayoutServiceState,
} from "./ui-layout/state";
import { UiSettingsState, defaultUiSettingsState } from "./ui-settings/state";

export interface AppServicesState {
  circuitEditorDrag: CircuitEditorDragServiceState;
  circuitEditors: CircuitEditorsServiceState;
  circuits: CircuitsServiceState;
  clipboard: ClipboardServiceState;
  dialog: DialogServiceState;
  nodeGraph: NodeGraphServiceState;
  nodeLayout: NodeLayoutServiceState;
  project: ProjectServiceState;
  selection: SelectionServiceState;
  simulator: SimulatorServiceState;
  simulatorControl: SimulatorControlServiceState;
  uiLayout: UiLayoutServiceState;
  uiSettings: UiSettingsState;
}

const _defaultServiceState: AppServicesState = {
  circuitEditorDrag: defaultCircuitEditorDragServiceState,
  circuitEditors: defaultCircuitEditorServiceState,
  nodeGraph: defaultNodeGraphServiceState,
  nodeLayout: defaultNodeLayoutServiceState,
  circuits: defaultCircuitsServiceState,
  clipboard: defaultClipboardServiceState,
  dialog: defaultDialogServiceState,
  project: defaultProjectServiceState,
  selection: defaultSelectionServiceState,
  simulator: defaultSimulatorServiceState,
  simulatorControl: defaultSimulatorControlServiceState,
  uiLayout: defaultUiLayoutServiceState,
  uiSettings: defaultUiSettingsState,
};

export const defaultServicesState = Object.freeze(_defaultServiceState);
