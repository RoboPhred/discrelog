import {
  CircuitEditorDragServiceState,
  defaultCircuitEditorDragServiceState,
} from "./circuit-editor-drag/state";
import {
  CircuitEditorsServiceState,
  defaultCircuitEditorServiceState,
} from "./circuit-editors/state";
import {
  CircuitGraphServiceState,
  defaultCircuitGraphServiceState,
} from "./circuit-graph/state";
import {
  CircuitLayoutServiceState,
  defaultCircuitLayoutServiceState,
} from "./circuit-layout/state";
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
  TutorialServiceState,
  defaultTutorialServiceState,
} from "./tutorial/state";
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
  circuitGraph: CircuitGraphServiceState;
  circuitLayout: CircuitLayoutServiceState;
  project: ProjectServiceState;
  selection: SelectionServiceState;
  simulator: SimulatorServiceState;
  simulatorControl: SimulatorControlServiceState;
  tutorial: TutorialServiceState;
  uiLayout: UiLayoutServiceState;
  uiSettings: UiSettingsState;
}

const _defaultServiceState: AppServicesState = {
  circuitEditorDrag: defaultCircuitEditorDragServiceState,
  circuitEditors: defaultCircuitEditorServiceState,
  circuitGraph: defaultCircuitGraphServiceState,
  circuitLayout: defaultCircuitLayoutServiceState,
  circuits: defaultCircuitsServiceState,
  clipboard: defaultClipboardServiceState,
  dialog: defaultDialogServiceState,
  project: defaultProjectServiceState,
  selection: defaultSelectionServiceState,
  simulator: defaultSimulatorServiceState,
  simulatorControl: defaultSimulatorControlServiceState,
  tutorial: defaultTutorialServiceState,
  uiLayout: defaultUiLayoutServiceState,
  uiSettings: defaultUiSettingsState,
};

export const defaultServicesState = Object.freeze(_defaultServiceState);
